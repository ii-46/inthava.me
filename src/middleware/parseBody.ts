import express from "express";

const parseBody = () => [
  express.urlencoded({ extended: true }),
  express.json(),
];
export default parseBody;
