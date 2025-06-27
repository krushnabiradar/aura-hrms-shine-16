
const express = require('express');
const path = require('path');

const serveStatic = () => {
  const uploadsPath = path.join(__dirname, '../../uploads');
  return express.static(uploadsPath);
};

module.exports = { serveStatic };
