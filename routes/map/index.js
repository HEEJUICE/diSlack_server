const express = require("express");
const util = require("util");
const googleMaps = require("@google/maps");

const router = express.Router();

const googleMapsClient = googleMaps.createClient({
  key: process.env.PLACES_API_KEY,
});

router.get("/", (req, res) => {
  res.send("HI");
});

router.get("/autocomplete/:query", (req, res, next) => {
  googleMapsClient.placesQueryAutoComplete(
    {
      input: req.params.query,
      language: "ko",
    },
    async (err, auto) => {
      if (err) {
        return next(err);
      }

      const googlePlaces = util.promisify(googleMapsClient.places);

      try {
        const response = await googlePlaces({
          query: req.params.query,
          language: "ko",
        });
        res.json({
          auto: auto.json.predictions,
          mark: response.json.results,
        });
      } catch (error) {
        console.error(error);
        next(error);
      }
      // return res.json(response.json.predictions);
    },
  );
});

router.get("/search/:query", async (req, res, next) => {
  const googlePlaces = util.promisify(googleMapsClient.places);
  try {
    const response = await googlePlaces({
      query: req.params.query,
      language: "ko",
    });
    res.render("result", {
      title: `${req.params.query} 검색 결과`,
      results: response.json.results,
      query: req.params.query,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
