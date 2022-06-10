const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const app = express();
const fs = require("fs");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const s3Actions = require("./s3Actions");
var multer = require("multer");
const archiver = require("archiver");
const ora = require('ora');
const inquirer = require('inquirer');
const { readFile, writeFile, readdir } = require("fs").promises;
const mergeImages = require('merge-images');
const { Image, Canvas } = require('canvas');
const ImageDataURI = require('image-data-uri');

var path = require("path");

require("dotenv").config({ path: "./config.env" });
// Uncomment for Database connection
// const dbo = require("./DB/connection");

const db = lowDb(new FileSync("./src/traffic.json"));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
const port = 8443;

const dirTree = require("directory-tree");

app.get("/getFolderTree", (req, res) => {
  const uuid = req.query.uuid;
  const tree = dirTree(`src/EditingPage/layers/${uuid}`);
  res.send(JSON.stringify(tree));
});

app.get("/getTotalUsers", (req, res) => {
  const data = db.get("TotalUsers").value();
  return res.json(data);
});

app.get("/getTotalItems", (req, res) => {
  const data = db.get("TotalItems").value();
  return res.json(data);
});

const dest = `src/EditingPage/layers/`;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    if (fs.existsSync(`${dest}/${file.fieldname}`)) {
      cb(null, `${file.fieldname}/${file.originalname}`);
    } else {
      fs.mkdirSync(`${dest}/${file.fieldname}`, { recursive: true });
      cb(null, `${file.fieldname}/${file.originalname}`);
    }
  },
});

const fields = [];
var filePaths = new Set();

var upload = multer({
  limits: { fileSize: 10485760 },
  storage: storage,
}).fields(fields);

app.post("/uploadFiles", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      // fs.rmdir(
      //   `./src/EditingPage/layers/${uuid}`,
      //   { recursive: true },
      //   (err) => {
      //     if (err) {
      //       return console.log("error occurred in deleting directory", err);
      //     }

      //     console.log("Directory deleted successfully");
      //   }
      // );
      console.log(err);
      return res.status(500).json(err);
    }

    return res.status(200).send(req.file);
  });
});

app.post("/uploadPath", (req, res) => {
  req.body.forEach((file) => {
    const filePath = file.path.split("/")[1];
    const hashKey = file.uuid;
    filePaths.add(hashKey + "/" + filePath);
  });

  filePaths.forEach((file) => {
    fields.push({ name: file });
  });
});

app.post("/deleteLocalFiles", (req, res) => {
  const data = req.body;
  const uuid = data.uuid;
  fs.rmdir(`./src/EditingPage/layers/${uuid}`, { recursive: true }, (err) => {
    if (err) {
      return console.log("error occurred in deleting directory", err);
    }

    console.log("Directory deleted successfully");
  });
  return res.status(200).json("Success");
});


//SETTINGS
let basePath;
let outputPath;
let traits;
let traitsToSort = [];
let order = [];
let weights = {};
let names = {};
let weightedTraits = [];
let seen = [];
let metaData = {};
let config = {
  metaData: {},
  useCustomNames: null,
  deleteDuplicates: null,
  generateMetadata: null,
};

const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000))


app.post("/submitDetails", async (request, response) => {
  const data = request.body;
  console.log('data', data)
  console.log(data.folderTree.children[0].children)

  basePath = process.cwd() + `/${data.folderTree.path}/`
  outputPath = process.cwd() + `/generated/${data.uuid}/`
  config.deleteDuplicates = true
  config.generateMetadata = true
  config.metaData.name = data.name;
  config.metaData.description = data.description;
  config.metaData.splitFiles = false;

  let lastChar = data.URL.slice(-1);
  if (lastChar === '/') config.imageUrl = data.URL;
  else config.imageUrl = data.URL + '/';

  const loadingDirectories = ora('Loading traits');
  loadingDirectories.color = 'yellow';
  loadingDirectories.start();

  traits = getDirectories(basePath);
  traitsToSort = [...traits];
  await sleep(2);
  loadingDirectories.succeed();
  loadingDirectories.clear();
  console.log('config1: ', config)
  config.order = data.layerOrder

  setWeights()
  
  console.log('config2: ', config)
  const generatingImages = ora('Generating images');
  generatingImages.color = 'yellow';
  generatingImages.start();
  await generateImages();
  await sleep(2);
  generatingImages.succeed('All images generated!');
  generatingImages.clear();

  /*
  if (config.generateMetadata) {
    const writingMetadata = ora('Exporting metadata');
    writingMetadata.color = 'yellow';
    writingMetadata.start();
    await writeMetadata();
    await sleep(0.5);
    writingMetadata.succeed('Exported metadata successfully');
    writingMetadata.clear();
  }
  */


});

app.get("/compress", (req, res) => {
  const uuid = req.query.uuid;
  const output = fs.createWriteStream(`generated/${uuid}.zip`);
  const archive = archiver("zip");

  archive.on("error", function (err) {
    res.status(500).send({ error: err.message });
  });

  //on stream closed we can end the request
  archive.on("end", function () {
    console.log("Archive wrote %d bytes", archive.pointer());
  });

  //set the archive name
  res.attachment(`${uuid}.zip`);

  //this is the streaming magic
  archive.pipe(output);

  archive.directory(`generated/${uuid}`, `${uuid}`);

  archive.finalize();

  return res.status(200).json("Success");
});

app.get("/upload", (req, res, next) => {
  const uuid = req.query.uuid;

  s3Actions.uploadFile(`generated/${uuid}.zip`, res);
});

app.get("/resolveFiles", function (req, res, next) {
  const uuid = req.query.uuid;

  // fs.unlink(`./generated/${uuid}.zip`, function (err) {
  //   if (err) throw err;
  //   console.log("File deleted!");
  // });

  return res.status(200).json("Success");
});


app.listen(port, () => {
  // Uncommented for connecting to mongoDB
  // dbo.connectToServer(function (err) {
  //   if (err) console.error(err);
  // });
  console.log(`Server is running on port: ${port}`);
  console.log(`Example app listening at ${port}`);
});


//SELECT THE ORDER IN WHICH THE TRAITS SHOULD BE COMPOSITED
async function traitsOrder(isFirst) {
  if (config.order && config.order.length === traits.length) {
    order = config.order;
    return;
  }
  const traitsPrompt = {
    type: 'list',
    name: 'selected',
    choices: [],
  };
  traitsPrompt.message = 'Which trait should be on top of that?';
  if (isFirst === true) traitsPrompt.message = 'Which trait is the background?';
  traitsToSort.forEach(trait => {
    const globalIndex = traits.indexOf(trait);
    traitsPrompt.choices.push({
      name: trait.toUpperCase(),
      value: globalIndex,
    });
  });
  const { selected } = await inquirer.prompt(traitsPrompt);
  order.push(selected);
  config.order = order;
  let localIndex = traitsToSort.indexOf(traits[selected]);
  traitsToSort.splice(localIndex, 1);
  if (order.length === traits.length) return;
  await traitsOrder(false);
}



//SET WEIGHTS FOR EVERY TRAIT
async function setWeights(trait) {
  if (config.weights && Object.keys(config.weights).length === Object.keys(names).length ) {
    weights = config.weights;
    return;
  }
  const files = await getFilesForTrait(trait);
  console.log(names)
  files.forEach((file, i) => {
    console.log(file)
  });
  files.forEach((file, i) => {
    weights[file] = selectedWeights[names[file] + '_weight'];
  });
  config.weights = weights;
}

//ASYNC FOREACH
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

//GENERATE WEIGHTED TRAITS
async function generateWeightedTraits() {
  for (const trait of traits) {
    const traitWeights = [];
    const files = await getFilesForTrait(trait);
    files.forEach(file => {
      for (let i = 0; i < weights[file]; i++) {
        traitWeights.push(file);
      }
    });
    weightedTraits.push(traitWeights);
  }
}

//GENARATE IMAGES
async function generateImages() {
  let noMoreMatches = 0;
  let images = [];
  let id = 0;
  await generateWeightedTraits();
  if (config.deleteDuplicates) {
    while (!Object.values(weightedTraits).filter(arr => arr.length == 0).length && noMoreMatches < 20000) {
      let picked = [];
      order.forEach(id => {
        let pickedImgId = pickRandom(weightedTraits[id]);
        picked.push(pickedImgId);
        let pickedImg = weightedTraits[id][pickedImgId];
        images.push(basePath + traits[id] + '/' + pickedImg);
      });

      if (existCombination(images)) {
        noMoreMatches++;
        images = [];
      } else {
        generateMetadataObject(id, images);
        noMoreMatches = 0;
        order.forEach((id, i) => {
          remove(weightedTraits[id], picked[i]);
        });
        seen.push(images);
        const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
        await ImageDataURI.outputFile(b64, outputPath + `${id}.png`);
        images = [];
        id++;
      }
    }
  } else {
    while (!Object.values(weightedTraits).filter(arr => arr.length == 0).length) {
      order.forEach(id => {
        images.push(
          basePath + traits[id] + '/' + pickRandomAndRemove(weightedTraits[id])
        );
      });
      generateMetadataObject(id, images);
      const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
      await ImageDataURI.outputFile(b64, outputPath + `${id}.png`);
      images = [];
      id++;
    }
  }
}

//GENERATES RANDOM NUMBER BETWEEN A MAX AND A MIN VALUE
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//PICKS A RANDOM INDEX INSIDE AN ARRAY RETURNS IT AND THEN REMOVES IT
function pickRandomAndRemove(array) {
  const toPick = randomNumber(0, array.length - 1);
  const pick = array[toPick];
  array.splice(toPick, 1);
  return pick;
}

//PICKS A RANDOM INDEX INSIDE AND ARRAY RETURNS IT
function pickRandom(array) {
  return randomNumber(0, array.length - 1);
}

function remove(array, toPick) {
  array.splice(toPick, 1);
}

function existCombination(contains) {
  let exists = false;
  seen.forEach(array => {
    let isEqual =
      array.length === contains.length &&
      array.every((value, index) => value === contains[index]);
    if (isEqual) exists = true;
  });
  return exists;
}

function generateMetadataObject(id, images) {
  metaData[id] = {
    name: config.metaData.name + ' #' + id,
    description: config.metaData.description,
    image: config.imageUrl + id,
    attributes: [],
  };
  images.forEach((image, i) => {
    let pathArray = image.split('/');
    let fileToMap = pathArray[pathArray.length - 1];
    metaData[id].attributes.push({
      trait_type: traits[order[i]],
      value: names[fileToMap],
    });
  });
}

async function writeMetadata() {
  if(config.metaData.splitFiles)
  {
    let metadata_output_dir = outputPath + "metadata/"
    if (!fs.existsSync(metadata_output_dir)) {
      fs.mkdirSync(metadata_output_dir, { recursive: true });
    }
    for (var key in metaData){
      await writeFile(metadata_output_dir + key, JSON.stringify(metaData[key]));
    }
  }else
  {
    await writeFile(outputPath + 'metadata.json', JSON.stringify(metaData));
  }
}

async function getFilesForTrait(trait) {
  return (await readdir(basePath + '/' + trait)).filter(file => file !== '.DS_Store');
}