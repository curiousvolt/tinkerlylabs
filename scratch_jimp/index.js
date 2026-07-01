const { Jimp } = require("jimp");
const path = require("path");

async function optimize() {
  const inputPath = path.join(__dirname, "../public/logo.png");
  const outputPath = path.join(__dirname, "../public/logo.png");

  console.log(`Optimizing ${inputPath}...`);
  try {
    const image = await Jimp.read(inputPath);
    await image
      .resize({ w: 512 })
      .write(outputPath);
    console.log(`Successfully optimized and overwrote ${outputPath}`);
  } catch (error) {
    console.error("Error optimizing image:", error);
  }
}

optimize();
