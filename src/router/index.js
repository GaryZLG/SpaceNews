/* 
 Use the express.Router class to create modular, mountable route handlers.
*/


// Require necessary NPM modules
const express = require("express");
const axios = require("axios");
const dayjs = require("dayjs");
const router = express.Router();

// Route for the home page
router.get("/", async (req, res) => {
    res.render("index.ejs");
});

// Routes to handle "detail" pages for blogs, reports, and articles
// These routes fetch data from an API and pass it to the EJS template for rendering
router.get("/blog/detail", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            res.render("404.ejs");
            return;
        }
        const result = await axios(
            `https://api.spaceflightnewsapi.net/v4/blogs/${id}/`
        );
        const data = result.data;
        if (data.title) {
            res.render("detail.ejs", { detail: data });
            return;
        }
        res.render("500.ejs");
    } catch (error) {
        console.error(error);
        res.render("500.ejs");
    }
});

router.get("/reports/detail", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            res.render("404.ejs");
            return;
        }

        const result = await axios(
            `https://api.spaceflightnewsapi.net/v4/reports/${id}/`
        );
        const data = result.data;
        if (data.title) {
            console.log(data);
            res.render("detail.ejs", { detail: data });
            return;
        }
        res.render("500.ejs");
    } catch (error) {
        console.error(error);
        res.render("500.ejs");
    }
});

router.get("/articles/detail", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            res.render("404.ejs");
            return;
        }
        const result = await axios(
            `https://api.spaceflightnewsapi.net/v4/articles/${id}/`
        );
        const data = result.data;
        if (data.title) {
            console.log(data);
            res.render("detail.ejs", { detail: data });
            return;
        }
        res.render("500.ejs");
    } catch (error) {
        console.error(error);
        res.render("500.ejs");
    }
});

// Route to get and return news site data
router.get("/news_site", async (req, res) => {
    try {
        const result = await axios(
            "https://api.spaceflightnewsapi.net/v4/info/"
        );
        const data = result.data;
        if (data.news_sites) {
            res.json({
                code: 200,
                msg: "success",
                data: {
                    list: data.news_sites,
                },
            });
            return;
        }
        res.json({
            code: 400,
            msg: "error",
            data: {},
        });
    } catch (error) {
        console.error(error);
        res.render("500.ejs");
    }
});

// Routes for listing blogs, articles, and reports with pagination
router.get("/blog", async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10 } = req.query;
        const result = await axios.get(
            `https://api.spaceflightnewsapi.net/v4/blogs?limit=${pageSize}&offset=${
                (pageNum - 1) * pageSize
            }`
        );
        const data = result.data;
        if (data.results) {
            res.json({
                code: 200,
                msg: "success",
                data: {
                    list: data.results.map((ele) => {
                        return {
                            ...ele,
                            publishTime: dayjs(ele.published_at).format(
                                "YYYY-MM-DD"
                            ),
                        };
                    }),
                    total: data.count,
                },
            });
            return;
        }
        res.json({
            code: 400,
            msg: "error",
            data: {},
        });
    } catch (error) {
        console.error(error);
        res.render("500.ejs");
    }
});

router.get("/articles", async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10 } = req.query;
        const result = await axios.get(
            `https://api.spaceflightnewsapi.net/v4/articles?limit=${pageSize}&offset=${
                (pageNum - 1) * pageSize
            }`
        );
        const data = result.data;
        if (data.results) {
            res.json({
                code: 200,
                msg: "success",
                data: {
                    list: data.results.map((ele) => {
                        return {
                            ...ele,
                            publishTime: dayjs(ele.published_at).format(
                                "YYYY-MM-DD"
                            ),
                        };
                    }),
                    total: data.count,
                },
            });
            return;
        }
        res.json({
            code: 400,
            msg: "error",
            data: {},
        });
    } catch (error) {
        console.error(error);
        res.render("500.ejs");
    }
});

router.get("/reports", async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10 } = req.query;
        const result = await axios.get(
            `https://api.spaceflightnewsapi.net/v4/reports?limit=${pageSize}&offset=${
                (pageNum - 1) * pageSize
            }`
        );
        const data = result.data;
        if (data.results) {
            res.json({
                code: 200,
                msg: "success",
                data: {
                    list: data.results.map((ele) => {
                        return {
                            ...ele,
                            publishTime: dayjs(ele.published_at).format(
                                "YYYY-MM-DD"
                            ),
                        };
                    }),
                    total: data.count,
                },
            });
            return;
        }
        res.json({
            code: 400,
            msg: "error",
            data: {},
        });
    } catch (error) {
        console.error(error);
        res.render("500.ejs");
    }
});

// Catch-all route for undefined routes, rendering a 404 page
router.all("*", (req, res) => {
    res.render("404.ejs");
});

// Export the router for use in the main app
module.exports = router;
