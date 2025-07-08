import csv from 'csv-parser';
import fs from 'fs';

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
      
        if (!row.date || !row.sku || !row.quantity || !row.price) return;

        results.push({
          date: row.date,           
          sku: row.sku.trim(),      
          quantity: row.quantity,   
          price: row.price         
        });
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

export default parseCSV;
