// Path Module - Basic Examples
// ==========================

// Step 1: Path module import করো (built-in তাই npm install লাগবে না)
const path = require('path');

console.log('=== Path Module শিখি ===\n');

// ১. path.join() - Path জোড়া লাগানো
// ------------------------------------
console.log('১. path.join() - Path জোড়া লাগানো:');

const folder = 'users';
const subfolder = 'documents';
const filename = 'report.pdf';

const fullPath = path.join(folder, subfolder, filename);
console.log('জোড়া লাগানো path:', fullPath);
// Output: users/documents/report.pdf (অথবা users\documents\report.pdf Windows এ)

// একাধিক folder একসাথে
const deepPath = path.join('home', 'user', 'projects', 'nodejs', 'app.js');
console.log('Deep path:', deepPath);
console.log('');

// ২. path.resolve() - Absolute Path তৈরি করা
// -------------------------------------------
console.log('২. path.resolve() - Absolute Path:');

const absolutePath = path.resolve('test.txt');
console.log('Absolute path:', absolutePath);
// তোমার current directory থেকে পুরো path দেখাবে

const customAbsolutePath = path.resolve('folder', 'subfolder', 'file.txt');
console.log('Custom absolute:', customAbsolutePath);
console.log('');

// ৩. path.basename() - ফাইলের নাম বের করা
// -----------------------------------------
console.log('৩. path.basename() - ফাইলের নাম:');

const filePath = '/home/user/documents/report.pdf';
const fileName = path.basename(filePath);
console.log('পুরো path:', filePath);
console.log('শুধু filename:', fileName);

// Extension ছাড়া নাম
const fileNameWithoutExt = path.basename(filePath, '.pdf');
console.log('Extension ছাড়া:', fileNameWithoutExt);
console.log('');

// ৪. path.dirname() - Folder এর নাম
// ----------------------------------
console.log('৪. path.dirname() - Folder path:');

const dirName = path.dirname(filePath);
console.log('File path:', filePath);
console.log('Directory:', dirName);
console.log('');

// ৫. path.extname() - File Extension
// -----------------------------------
console.log('৫. path.extname() - Extension বের করা:');

console.log('.pdf file:', path.extname('document.pdf'));
console.log('.js file:', path.extname('app.js'));
console.log('.txt file:', path.extname('readme.txt'));
console.log('No extension:', path.extname('README'));
console.log('');

// ৬. path.parse() - Path কে Object এ ভাগ করা
// -------------------------------------------
console.log('৬. path.parse() - Path breakdown:');

const parsedPath = path.parse('/home/user/documents/report.pdf');
console.log('Parsed path object:');
console.log(parsedPath);
/*
Output দেখতে এমন হবে:
{
  root: '/',
  dir: '/home/user/documents',
  base: 'report.pdf',
  ext: '.pdf',
  name: 'report'
}
*/
console.log('');

// ৭. path.format() - Object থেকে Path তৈরি করা
// ---------------------------------------------
console.log('৭. path.format() - Object to Path:');

const pathObject = {
  dir: '/home/user/documents',
  base: 'newfile.txt'
};

const formattedPath = path.format(pathObject);
console.log('Formatted path:', formattedPath);
console.log('');

// ৮. path.sep - Path Separator
// -----------------------------
console.log('৮. path.sep - Separator:');
console.log('Current OS separator:', path.sep);
console.log('Path with separator:', 'folder' + path.sep + 'file.txt');
console.log('');

// ৯. path.delimiter - Environment variable delimiter
// ---------------------------------------------------
console.log('৯. path.delimiter - PATH delimiter:');
console.log('Delimiter:', path.delimiter);
// Windows: ; (semicolon)
// Linux/Mac: : (colon)
console.log('');

// ১০. path.isAbsolute() - Absolute path কিনা check করা
// ------------------------------------------------------
console.log('১০. path.isAbsolute() - Check absolute:');

console.log('/home/user is absolute?', path.isAbsolute('/home/user'));
console.log('folder/file is absolute?', path.isAbsolute('folder/file'));
console.log('C:\\Users is absolute?', path.isAbsolute('C:\\Users'));
console.log('');

console.log('=== Path Module Complete! ===');