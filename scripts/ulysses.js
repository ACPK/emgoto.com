#!/usr/bin/env node

/**
 * I write my blog posts in the Ulysses text editor. 
 * 
 * Once I'm done, I export it as a `.textpack` file (which is a zip file containing both markdown and images).
 * 
 * I use this script to move it to the correct place, change file names/location as required, and also add frontmatter to the top of the page!
 */

const { createReadStream, createWriteStream, rename, unlink, rmdir } = require('fs')
const { join, dirname } = require('path')
const glob = require('glob')
const YAML = require('yaml')
const replace = require('replace-in-file');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const frontMatter = (title) => 
`---
title: "${title.replace('# ', '').trim()}"
date: ${formatDate(new Date())}
tags: []
category: "blog"
emoji:
coverImage: ''
---
`;

const ulysses = () => {
    const file = glob.sync(join(process.cwd(), 'scripts', '**', '*.textbundle'))[0];
    const slug = file.match(/\/([^\/]+).textbundle/)[1];
    const extractToDirectory = join(process.cwd(), 'posts');
    const newFolder = `${extractToDirectory}/${slug}`;
    rename(file, newFolder, () => {});

    const images = glob.sync(join(newFolder, 'assets', '*'));
    images.forEach(image => {
        let imageName = image.match(/assets\/([^\/]+)/)[1];
        rename(image, `${newFolder}/${imageName}`, () => {
            rmdir(`${newFolder}/assets`, () => {});
            unlink(`${newFolder}/info.json`, () => {});
        
            rename(`${newFolder}/text.md`, `${newFolder}/index.md`, () => {
                const options = {
                    files: `${newFolder}/index.md`,
                    from: [/\[\]\(assets/g, /^# .*/g],
                    to: ['[](.', title => frontMatter(title)],
                };
            
                replace.sync(options);
            });
        });
    });


}

ulysses();

