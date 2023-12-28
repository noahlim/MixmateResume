const isSet = (value) =>
{
  if(value === undefined || value === null || value === false)
    return false;
  else if(typeof(value) === 'string' && value.trim() === '')
    return false;
  
  return true;
}

const isNotSet = (value) =>
{
  return !isSet(value);
}

function Result(_isOk = false)
{
  this.isOk = _isOk;
  this.message = '';
  this.data = false;

  this.setTrue = (msg = '') =>
  {
    this.isOk = true;
    this.message = msg;
  }
  this.setFalse = (msg = '') =>
  {
    this.isOk = false;
    this.message = msg;
  }
}
function recipeIngredientsComplete(recipe, userIngredients) {
  for (let i = 1; i <= 15; i++) {
      const ingredientKey = `strIngredient${i}`;
      if (recipe[ingredientKey] && !userIngredients.includes(recipe[ingredientKey])) {
          return false;
      }
  }
  return true;
}

async function readRequestBody(readableStream: ReadableStream<Uint8Array>): Promise<any> {
  const reader = readableStream.getReader();
  let chunks: Uint8Array[] = [];
  let result: string = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  if (chunks.length > 0) {
    result = new TextDecoder().decode(concatUint8Arrays(chunks));
    try {
      return JSON.parse(result);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Error parsing JSON');
    }
  }

  return {};
}

function concatUint8Arrays(chunks: Uint8Array[]): Uint8Array {
  let totalLength = chunks.reduce((length, chunk) => length + chunk.length, 0);
  let result = new Uint8Array(totalLength);
  let length = 0;

  for (let chunk of chunks) {
    result.set(chunk, length);
    length += chunk.length;
  }

  return result;
}
export
{
  isSet, isNotSet, Result, recipeIngredientsComplete, concatUint8Arrays, readRequestBody 
}
