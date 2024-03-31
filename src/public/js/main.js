

// Pagination constructor function
function Pagination(obj, fn) {
    this.fn = fn;
    this.init(obj);
}

// Prototypical inheritance for Pagination
Pagination.prototype = {
    pages: {
        pageCount: 0, // Total pages
        size: 10, // Data size per page
        pageNo: 1, // Current page number
    },

    // Initialize page data, parameter: obj
    init: function (obj) {
        let pages = this.pages;
        pages.total = obj.total; // Total data
        obj.pageCount = Math.ceil(obj.total / obj.size); // Calculate the total number of pages
        pages.container = obj.container; // Container
        pages.pageNo = obj.pageNo; // Current page number
        pages.pageCount = obj.pageCount; // Total pages
        pages.eleHtml = obj.eleHtml; // Page number button
        pages.prevPage = obj.prevPage || "prevPage"; // Previous page button
        pages.nextPage = obj.nextPage || "nextPage"; // Next page button
        this.renderPage(pages);
    },

    // Construct the page, parameter: args
    renderPage(args) {
        let pageContainer = this.selectEle(args.container);
        let pageStr = "",
            start,
            end;
        
        // Construct the left button
        if (args.pageNo > 1) {
            pageStr = `<a class="prevPage">prev</a>`;
        } else { // Construct the middle button
            pageStr = `<a class="disabled">prev</a>`;
        }

        // When the total number of pages is less than 6
        if (args.pageCount < 6) {
            for (start = 0; start < args.pageCount; start++) {
                end = start + 1;

                if (end == args.pageNo) {
                    pageStr += '<a class="current">' + end + "</a>";
                } else {
                    pageStr += "<a>" + end + "</a>";
                }

            }
        } else { // When the total number of pages is greater than or equal to 6
            
            // Confirm the start position of the traversal
            start = args.pageNo - 1; 

            // Confirm the end position of the traversal
            end = args.pageNo + 1; 

            // When the current page is greater than 2, lock the first page button
            if (args.pageNo > 2) {
                pageStr += "<a>" + 1 + "</a>";
            } else { // When the current page is less than or equal to 2, lock the fourth page button
                end = 4;
            }

             // When the current page is greater than the total number of pages minus 3, 
             // lock the fourth page button
            if (args.pageNo > args.pageCount - 3) {
                start = args.pageCount - 3;
            }

           // When the current page is greater than 3, lock the ellipsis button
            if (args.pageNo > 3) {
                pageStr += "<a>...</a>";
            } 

            // Traverse the middle button
            for (; start <= end; start++) {
                if (start <= args.pageCount && start > 0) {
                    if (start == args.pageNo) {
                        pageStr += '<a class="current">' + start + "</a>";
                    } else {
                        pageStr += "<a>" + start + "</a>";
                    }
                }
            }

            // When the current page is less than the total number of pages minus 2, 
            // lock the ellipsis button
            if (args.pageNo < args.pageCount - 2) {
                pageStr += "<a>...</a>";
            }
            
            // When the current page is less than the total number of pages minus 1, 
            // lock the last page button
            if (args.pageNo < args.pageCount - 1) {
                pageStr += "<a>" + args.pageCount + "</a>";
            } 
        }

        // Construct the right button
        if (args.pageNo < args.pageCount) {
            pageStr += `<a class="nextPage">next</a>`;
        } else {
            pageStr += `<a class="disabled">next</a>`;
        }
        pageContainer.innerHTML = pageStr;
        this.switchPage();
    },
    
    // Switch page
    switchPage() {
        let pages = this.pages,
            g = this;
        
        // Get all a tags
        let aList = this.selectEle(pages.container + " a", true); 
        // Define a current page identifier
        let current;

        // Traverse all a tags and bind click events
        for (i in aList) {
            if (i < aList.length) {
                aList[i].addEventListener("click", function () {
                    // Define an attribute value to get the number button
                    let eleHtml = this.innerHTML; 

                    if (this.className == pages.prevPage) {
                        pages.pageNo > 1 && (pageNo = pages.pageNo - 1);
                    } else if (this.className == pages.nextPage) {
                        pages.pageNo < pages.pageCount &&
                            (pageNo = pages.pageNo + 1);
                    } else {
                        pageNo = parseInt(eleHtml);
                    }

                    pageNo && g.gotoPage(pageNo);
                });
            }
        }
    },
    // Jump to the page, parameter: current
    gotoPage(current) {
        this.pages.pageNo = current;
        this.renderPage(this.pages);
        this.callback();
    },
    callback() {
        this.fn(this.pages.pageNo, this.pages.size);
    },
    // Get page elements
    selectEle(select, all) {
        return all
            ? document.querySelectorAll(select)
            : document.querySelector(select);
    },
};

// Get news sites
const getNewsSites = () => {
    $("#loading").show();
    const pageNum = 1;
    const pageSize = 10;
    fetch("/news_site")
        .then((res) => res.json())
        .then((res) => {
            if (res.code !== 200) {
                alert(res.msg);
                return;
            }
            const list = res.data.list;
            const data = list.length
                ? list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
                : [];
            $(".main_news_sites--list").empty();
            data.forEach((ele) => {
                const li = `
                            <li class="main_news_sites--item">
                                <a href="#">
                                    <span>${ele}</span>
                                    <i class="fa fa-caret-right" aria-hidden="true"></i>
                                </a>
                            </li>
                        `;
                $(".main_news_sites--list").append(li);
            });
            // Pagination
            new Pagination(
                {
                    container: ".main_news_sites--page",
                    size: pageSize,
                    pageNo: pageNum,
                    total: list.length,
                },
                function (pageNum, pageSize) {
                    const data = list.length
                        ? list.slice(
                              (pageNum - 1) * pageSize,
                              pageNum * pageSize
                          )
                        : [];
                    $(".main_news_sites--list").empty();
                    data.forEach((ele) => {
                        const li = `
                        <li class="main_news_sites--item">
                            <a href="#">
                                <span>${ele}</span>
                                <i class="fa fa-caret-right" aria-hidden="true"></i>
                            </a>
                        </li>
                    `;
                        $(".main_news_sites--list").append(li);
                    });
                }
            );
        })
        .finally(() => {
            $("#loading").hide();
        });
};

// Get blog list
const getBlogList = () => {
    const blogCache = JSON.parse(localStorage.getItem("blog_list") || "{}");
    if (Object.keys(blogCache).length) {
        const now = Date.now();
        const cacheTime = Number(blogCache.time);
        if (now - cacheTime < 1 * 60 * 60 * 1000) {
            const list = blogCache.list;
            $(".main__blog--list").empty();
            list.forEach((ele) => {
                const content = `
                    <img src="${ele.image_url}" alt="post image one" class="main__blog--img">
                    <div class="main__blog--details">
                        <a href="http://localhost:3000/blog/detail?id=${ele.id}">
                            <h4 class="heading-hover">${ele.title}</h4>
                        </a>
                        <i class="fa fa-calendar" aria-hidden="true"></i>
                        <span class="main__blog--contact">${ele.publishTime}</span>
                    </div>
                `;
                $(".main__blog--list").append(content);
            });
            return;
        }
    }

    $("#loading").show();
    const pageNum = Math.floor(Math.random() * 200);
    const pageSize = 5;
    fetch(`/blog?pageNum=${pageNum}&pageSize=${pageSize}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.code !== 200) {
                alert(res.msg);
                return;
            }
            const list = res.data.list;
            localStorage.setItem(
                "blog_list",
                JSON.stringify({ time: Date.now(), list })
            );
            $(".main__blog--list").empty();
            list.forEach((ele) => {
                const content = `
                    <img src="${ele.image_url}" alt="post image one" class="main__blog--img">
                    <div class="main__blog--details">
                        <a href="http://localhost:3000/blog/detail?id=${ele.id}">
                            <h4 class="heading-hover">${ele.title}</h4>
                        </a>
                        <i class="fa fa-calendar" aria-hidden="true"></i>
                        <span class="main__blog--contact">${ele.publishTime}</span>
                    </div>
                `;
                $(".main__blog--list").append(content);
            });
        })
        .finally(() => {
            $("#loading").hide();
        });
};

// Get articles by top content
const getArticlesByTopContent = () => {
    $("#loading").show();
    const pageNum = Math.floor(Math.random() * 100);
    const pageSize = 1;
    fetch(`/articles?pageNum=${pageNum}&pageSize=${pageSize}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.code !== 200) {
                alert(res.msg);
                return;
            }
            const list = res.data.list;
            if (list.length) {
                const firstData = list[0];
                $(".main__text .heading-tertiary a").text(firstData.title);
                $(".main__text .heading-tertiary a").attr(
                    "href",
                    "http://localhost:3000/articles/detail?id=" + firstData.id
                );
                $(".main__text .main__link h5").text(firstData.publishTime);
                $(".main__content .main__image").attr(
                    "src",
                    firstData.image_url
                );
            }
        })
        .finally(() => {
            $("#loading").hide();
        });
};

const getArticlesByCenterContent = () => {
    $("#loading").show();
    const pageNum = Math.floor(Math.random() * 500);
    const pageSize = 1;
    fetch(`/articles?pageNum=${pageNum}&pageSize=${pageSize}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.code !== 200) {
                alert(res.msg);
                return;
            }
            const list = res.data.list;
            if (list.length) {
                const firstData = list[0];
                $(".main__center__content .heading-quaternary").text(
                    firstData.title
                );
                $(".main__center__content .main__link .heading-detail a").attr(
                    "href",
                    "http://localhost:3000/articles/detail?id=" + firstData.id
                );
                $(".main__center__content .paragraph").text(firstData.summary);
                $(".main__subcard .main__subcard--image").attr(
                    "src",
                    firstData.image_url
                );
            }
        })
        .finally(() => {
            $("#loading").hide();
        });
};

// Get articles by banner content
const getArticlesByBannerContent = () => {
    $("#loading").show();
    const pageNum = Math.floor(Math.random() * 800);
    const pageSize = 1;
    fetch(`/articles?pageNum=${pageNum}&pageSize=${pageSize}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.code !== 200) {
                alert(res.msg);
                return;
            }
            const list = res.data.list;
            if (list.length) {
                const firstData = list[0];
                $(
                    ".main__subcard .main__banner_content .heading-quaternary"
                ).text(firstData.title);
                $(".main__subcard .main__banner_content .paragraph").text(
                    firstData.summary
                );
                $(".main__banner_content .main__link .heading-detail a").attr(
                    "href",
                    "http://localhost:3000/articles/detail?id=" + firstData.id
                );
            }
        })
        .finally(() => {
            $("#loading").hide();
        });
};

const getReportsList = () => {
    const reportsCache = JSON.parse(
        localStorage.getItem("reports_list") || "{}"
    );
    if (Object.keys(reportsCache).length) {
        const now = Date.now();
        const cacheTime = Number(reportsCache.time);
        if (now - cacheTime < 1 * 60 * 60 * 1000) {
            const list = reportsCache.list;
            $(".main__reports").empty();
            list.forEach((ele) => {
                const content = `
					<div class="col-md-6 col-sm-12 mx-auto">
						<div class="card">
							<img class="card-img-top" src="${ele.image_url}" alt="Card image cap">
							<div class="card-body">
								<h2 class="heading-tag">
									<a href="http://localhost:3000/reports/detail?id=${ele.id}">${ele.title}</a>
								</h2>
								<p class="card-text">${ele.summary}</p>
								<button class="btn-blogger">${ele.news_site}</button>
							</div>
						</div>
					</div>
                `;
                $(".main__reports").append(content);
            });
            return;
        }
    }

    $("#loading").show();
    const pageNum = Math.floor(Math.random() * 200);
    const pageSize = 6;
    fetch(`/articles?pageNum=${pageNum}&pageSize=${pageSize}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.code !== 200) {
                alert(res.msg);
                return;
            }
            const list = res.data.list;
            localStorage.setItem(
                "reports_list",
                JSON.stringify({ time: Date.now(), list })
            );
            $(".main__reports").empty();
            list.forEach((ele) => {
                const content = `
					<div class="col-md-6 col-sm-12 mx-auto">
						<div class="card">
							<img class="card-img-top" src="${ele.image_url}" alt="Card image cap">
							<div class="card-body">
								<h5 class="heading-tag">
									<a href="http://localhost:3000/reports/detail?id=${ele.id}">${ele.title}</a>
								</h5>
								<p class="card-text">${ele.summary}</p>
								<button class="btn-blogger">${ele.news_site}</button>
							</div>
						</div>
					</div>
                `;
                $(".main__reports").append(content);
            });
        })
        .finally(() => {
            $("#loading").hide();
        });
};

jQuery(document).ready(() => {
    jQuery(".content, .sidebar").theiaStickySidebar({
        additionalMarginTop: 30,
    });
    $("body").append(
        '<div id="loading" style="display:none;position:fixed;z-index:9999;top:0;left:0;height:100%;width:100%;background: rgba(0,0,0,1) url(\'/img/loading.jfif\') no-repeat fixed center;"></div>'
    );
    getNewsSites();
    getBlogList();
    getArticlesByTopContent();
    getArticlesByCenterContent();
    getArticlesByBannerContent();
    getReportsList();
});

$(window).scroll(() => {
    if ($(window).scrollTop() > 56) {
        $(".navbar").addClass("nav-scroll");
    } else {
        $(".navbar").removeClass("nav-scroll");
    }
});

$(".navbar-nav a").on("click", () => {
    $(".navbar-collapse").removeClass("show");
});

$(".main__subcard--text .heading-tag").on("click", () => {
    getArticlesByCenterContent();
});

$(".main__text .main__refresh").on("click", () => {
    getArticlesByTopContent();
});

$(".main__blog .main__blog--refresh").on("click", () => {
    localStorage.removeItem("blog_list");
    getBlogList();
});
