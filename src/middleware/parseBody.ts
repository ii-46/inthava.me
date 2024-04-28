import express from "express";

export default function parseBody() {
  return [express.urlencoded({ extended: true }), express.json()];
}