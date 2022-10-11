const fs = require('fs').promises
const _ = require('lodash')
const { translate } = require('google-translate-api-browser');



const joinData = async (pathToExistData, pathToNewData) => {
  let newData;
  let existData;

  try {
    existData = await fs.readFile(pathToExistData, { encoding: 'utf-8' })
    newData = await fs.readFile(pathToNewData, { encoding: 'utf-8' })
  } catch (e) {
    throw Error('File read error: ', e)
  }

  const new_data = JSON.parse(newData)
  const exist_data = JSON.parse(existData)

  const result = _.map(new_data, (new_info) => {
    for (const data of exist_data) {
      if (data.field_name === new_info.field_name) {
        return Object.assign(data, field_name);
      }
    }
  });


  try {
    await fs.writeFile('translated/file.json', JSON.stringify(result))
  } catch (e) {
      throw Error('File write error: ', e)
  }
}
// joinData('translated/file.json', './files/data.json');

const translateFile = async (filePath, languageKey) => {
  const data_objects = JSON.parse(await fs.readFile(filePath))

  let translatedData = [];
  for (const data of data_objects) {
    const keys = Object.keys(data)
    for (const key of keys) {
      if (_.isNull(data[key])) continue
      try {
        data[key] = (await translate(data[key], { to: languageKey })).text
      } catch (e) {
        console.log('failed translate')
        throw Error(e)
      }
    }
    console.log(data);
    translatedData.push(data)
  }

  try {
    await fs.appendFile(`translated/${languageKey}-file.json`, JSON.stringify(translatedData))
  } catch (e) {
    throw Error('Failed write translated file')
  }
}
// translateFile('./translated/file.json', 'uk')

const printData = async (filePath) => {
  const objects = JSON.parse(await fs.readFile(filePath))
  for (const object of objects) {
    console.log(`${object.field_name_1} - ${object.field_name_2}`)
  }
}
// printData('translated/uk-file.json')
