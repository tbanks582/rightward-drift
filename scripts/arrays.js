// console.log(data);
// 1. instead of creating the cards manually, we should use array functions to convert the data into cards

// now we need to get the data in some other way

// 1. we need to get the data from somewhere

const locationOfData = "data.json";
let data = {};
let courseCards = [];
let filteredCourses = [];
let filteredCourseCards = [];
const resultsContainer = document.querySelector("#filtered-results");

function timeParity(cb) {
  setTimeout(() => {
    let t = Date.now() / 1000;
    console.log("t", t);
    console.log("t", t % 2 === 1 ? "odd" : "even");
    cb(t % 2 === 1 ? "odd" : "even");
  }, Math.random() * 1000);
}

function dataLocationFromParity(p) {
  return locationOfData.replace("data.", `data-${p}.`);
}

//callback version
function reqListener() {
  console.log("reqListener");
  const structuredData = JSON.parse(this.responseText);
  // console.log("structuredData", structuredData);
  data = structuredData;
  init();
}
const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", locationOfData);
req.send();

//promises version

// function logWhenSuccessful (response) {
//   console.log("response", response);
//   return response;
// }

// function dealWithException (err) {
//   console.error(err);
// }

// const responsePromise = fetch(locationOfData)
// responsePromise.then(logWhenSuccessful)
// responsePromise.catch(dealWithException)

const courseToCard = ({
  prefix,
  number,
  title,
  url,
  desc,
  prereqs,
  credits,
}) => {
  const prereqLinks = prereqs
    .map((prereq) => `<a href="#" class="card-link">${prereq}</a>`)
    .join();
  const courseTemplate = `<div class="col">
            <div class="card" style="width: 18rem;">
              <h3 class="card-header"><a href="${url}">${title}</a></h3>
              <div class="card-body">
                <h5 class="card-title">${prefix} ${number}</h5>
                <p class="card-text">${desc}</p>
                ${prereqLinks}
                <div class="card-footer text-muted">
                  ${credits}
                </div>
              </div>
            </div>
          </div>`;
  return courseTemplate;
};

function handleCourseDetails() {
  console.log("handleCourseDetails");
  const structuredData = JSON.parse(this.responseText);
  // console.log("detailed course info", structuredData);

  // i cut the remainder of this function body from elsewhere and pasted it
  // in this function so that it would run after the course details were loaded

  let resultOfTP;
  timeParity(function (val) {
    console.log("val", val);
    resultOfTP = val;
  });
  // we cannot expect resultOfTP to be useful
  // here because it gets the value asynchronously
  // instead we need to ensure we only use it AFTER the function we gave to
  // timeParity has been invoked

  // so as above, you'll need to cut the below and paste it elsewhere at a place
  // where we know that timeParity has been invoked

  console.log(
    "dataLocationFromParity(resultOfTP)",
    dataLocationFromParity(resultOfTP)
  );

  function gotParityFile(results) {
    console.log("results from getting parity file", results);
  }

  const reqParity = new XMLHttpRequest();
  reqParity.addEventListener("load", gotParityFile);
  reqParity.open("GET", dataLocationFromParity(resultOfTP));
  reqParity.send();
}

function init() {
  filteredCourses = data.items;
  courseCards = data.items.map(courseToCard);
  filteredCourseCards = courseCards;
  resultsContainer.innerHTML = filteredCourseCards.join("");
  updateCount();

  //  for each course,
  for (let i = 0; i < filteredCourses.length; i++) {
    //    get the detailed info about that course <prefix+number>.json
    //      log the detailed info
    let currentCourse = `${filteredCourses[i].prefix}${filteredCourses[i].number}.json`;
    console.log("currentCoursei", i);
    const req = new XMLHttpRequest();
    req.addEventListener("load", handleCourseDetails);
    req.open("GET", currentCourse);
    req.send();
  }

  //      get the timeParity
  //        log the timeParity
  //        get the data file corresponding to the timeParity (dataLocationFromParity can help)
  //        log the parity-text
}
// courseCards.forEach((c) => document.write(c));

// console.log(courseCards);
// document.write(courseCards.join(''))

// 2. maybe we only show those that match the search query?
//

const filterCourseCard = (courseObj, query) => {
  // console.log(courseObj, query);
  return (
    courseObj.title.toLowerCase().includes(query.toLowerCase()) ||
    courseObj.desc.toLowerCase().includes(query.toLowerCase()) ||
    courseObj.prefix.toLowerCase().includes(query.toLowerCase()) ||
    (!isNaN(parseInt(query, 10)) && courseObj.number === parseInt(query, 10))
  );
};

// const searchButton = document.getElementById("search-btn");
const searchField = document.querySelector('input[name="query-text"]');

searchField.addEventListener("input", (ev) => {
  // console.log(ev);
  ev.preventDefault();
  console.log("query text");

  const queryText = searchField.value;
  console.log(queryText);
  // debugger
  filteredCourses = filteredCourseCards = data.items.filter((course) =>
    filterCourseCard(course, queryText)
  );
  filteredCourseCards = filteredCourses.map(courseToCard);
  // console.log("filteredCourseCards", filteredCourseCards);
  resultsContainer.innerHTML = filteredCourseCards.join("");
  updateCount();
});

// 3. we update the result count and related summary info as we filter
function updateCount() {
  const count = document.getElementById("result-count");
  const countValue = filteredCourses.length;
  count.innerText = `${countValue} items`;
}
