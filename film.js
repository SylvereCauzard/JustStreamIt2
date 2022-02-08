async function getData(url)
// Get json data of request
{
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

async function getBestMovies(genre, moviesNumber = 8)
// Show the best movies
{

    let url = MAIN_URL + String(genre) + `&page_size=${moviesNumber}`;
    let search_result = await getData(url);
    
    return search_result.results;
}

function createImgElements(location)
// Create four div with "element" class at the location
{
    let div = document.createElement("div");
    div.classList.add("element");
    let button_prev = document.createElement("button");
    button_prev.classList.add("buttonprev");
    button_prev.setAttribute("onclick", `prev()`);
    let img = document.createElement("img")
    img.setAttribute("src", "Image/fleche_gauche.png");
    button_prev.appendChild(img);
    div.appendChild(button_prev);
    location.appendChild(div);

    for (let i = 0; i < 8; i++) {
        let div = document.createElement("div");
        div.classList.add("element");
        let img = document.createElement("img");
        img.setAttribute("id", "cover" + String(i + 1));
        img.setAttribute("onclick", "openTheModal()");
        img.setAttribute("src", ``)
        div.appendChild(img);
        location.appendChild(div);
    }

    div = document.createElement("div");
    div.classList.add("element");
    let button_next = document.createElement("button");
    button_next.classList.add("buttonnext");
    button_next.setAttribute("onclick", `next()`);
    img = document.createElement("img")
    img.setAttribute("src", "Image/fleche_droite.png");
    button_next.appendChild(img);
    div.appendChild(button_next);
    location.appendChild(div);

    let movies_list = Array.from(location.querySelectorAll("[id^='cover']"));
    hideElements(movies_list);

    location.getElementsByClassName("buttonnext")[0].onclick = function (){slideNext(movies_list, location);};
    location.getElementsByClassName("buttonprev")[0].onclick = function (){slidePrev(movies_list, location);};

    return movies_list;
}

function createDivWithClass(string_class)
// create div with class in parameters
{
    let div = document.createElement("div");
    div.classList.add(String(string_class));
    return div;
}

function createBestMovieElement(location)
// Create tag for showing the best movie
{
    let img = document.createElement("img");
    img.classList.add("top_film");
    location.appendChild(img);
    let div_box = createDivWithClass("element_box");
    location.appendChild(div_box);
    let div = createDivWithClass("movie_title");
    div_box.appendChild(div);
    div = createDivWithClass("play");
    div.innerHTML = "Play";
    div_box.appendChild(div);
    div = createDivWithClass("info")
    div.innerHTML = "Info";
    div.setAttribute("onclick", "");
    div_box.appendChild(div);
    let div_resume = createDivWithClass("top_resume");
    div_box.appendChild(div_resume);
    let p_text = document.createElement("p");
    div_resume.appendChild(p_text);

}

async function bestMovies(html_elements, genre)
// replace the content of src by the requested best movies image url and assign Openthemodal onclick function too
{
    const BEST_MOVIES_RESULT = await getBestMovies(genre);
    let number = 1;
    html_elements.pop()
    for (let element of html_elements) {
        element.setAttribute("src", BEST_MOVIES_RESULT[number].image_url);
        let movie_url = BEST_MOVIES_RESULT[number].url;
        element.onclick = function (){openTheModal(movie_url);};
        number++;
    }
}

async function bestOtherMovies(html_elements, genre)
// replace the content of src by the requested best movies image url and assign Openthemodal onclick function too
{
    const BEST_MOVIES_RESULT = await getBestMovies(genre);
    let number = 0;
    html_elements.pop()
    for (let element of html_elements) {
        element.setAttribute("src", BEST_MOVIES_RESULT[number].image_url);
        let movie_url = BEST_MOVIES_RESULT[number].url;
        element.onclick = function (){openTheModal(movie_url);};
        number++;
    }
}

async function showTopMovie(genre)
// Request the best Movie and assign them data to the best movie box html.
{
    const BEST_MOVIES_RESULT = await getBestMovies(genre);
    const MOVIE_RESULT = await getData(BEST_MOVIES_RESULT[0].url)
    let movie = document.getElementsByClassName("top_film")[0];
    let info_movie = document.getElementsByClassName("info")[0];
    movie.setAttribute("src", MOVIE_RESULT.image_url);
    movie.setAttribute("onclick", "");
    movie.onclick = function (){openTheModal(MOVIE_RESULT.url)};
    info_movie.onclick = function (){openTheModal(MOVIE_RESULT.url)};
    document.getElementsByClassName("top_resume")[0].getElementsByTagName("p")[0].innerHTML = MOVIE_RESULT.long_description;
    document.getElementsByClassName("movie_title")[0].innerHTML = MOVIE_RESULT.title;
}

function slidePrev(movies_list, location)
//Slide prev image
{
    for (let step = 0; step < 8; step++) {
        movies_list = swapNodes(movies_list[0], movies_list[step], location);
    }
    swapNodes(movies_list[0], movies_list[7], location);
}

function slideNext(movies_list, location)
// Slide next image
{
    movies_list = Array.from(location.querySelectorAll("[id^='cover']"));
    for (let step = 7; step > 0; step--) {
        movies_list = swapNodes(movies_list[step], movies_list[0], location);
    }
    swapNodes(movies_list[6], movies_list[7], location);
}

function swapNodes(a, b, location)
// Swap two elements.
{
    let aparent = a.parentNode;
    let asibling = a.nextSibling === b ? a : a.nextSibling; // var = Condition ? Si vrai : Si faux
    b.parentNode.insertBefore(a, b);
    aparent.insertBefore(b, asibling);
    let elements_location = Array.from(location.querySelectorAll("[id^='cover']"));
    return elements_location;
}

function hideElements(movies_list)
// hide elements of movies list 4 => 7.
{
    for (let element of movies_list.slice(4, 8)) {
        element.parentNode.style.display = "none";
    }
}

async function openTheModal(url)
// Open a modal box
{
    let modal = document.getElementById("my_modal");
    modal.style.display = "block";
    response = await getData(url);

    modal.getElementsByClassName("modal_movie_title")[0].innerHTML = (response.title);
    modal.getElementsByClassName("movie_image")[0].setAttribute("src", response.image_url)

    for (let div_element of document.getElementById("model_body").querySelectorAll("div")) {
        console.log(div_element)
        if (div_element.className === "long_description") {
            modal.getElementsByClassName("long_description")[0].getElementsByTagName("p")[0].innerHTML = (response.long_description);
        } else if (div_element.className === "duration") {
            div_element.innerHTML = ("<u>" + div_element.className.toUpperCase() + "</u>" + " : " + response[div_element.className] + " min");
        } else {
            div_element.innerHTML = ("<u>" + div_element.className.toUpperCase() + "</u>" + " : " + response[div_element.className]);
        }
        if (response[div_element.className] === null) {
            div_element.innerHTML = ("<u>" + div_element.className.toUpperCase() + "</u>" + " : " + " Unknown income");
        }
        
    }
}

function closeTheModal()
// Close the modal box
{
    let modal = document.getElementById("my_modal");
    modal.style.display = "none";
}

//display movie(s)
const MAIN_URL = "http://localhost:8000/api/v1/titles/";
let best_movie_location = document.getElementsByClassName("box1")[0];
let best_carousel_movies_location = document.getElementsByClassName("carousel1")[0];
let best_carousel_action_location = document.getElementsByClassName("carousel2")[0];
let best_carousel_horror_location = document.getElementsByClassName("carousel3")[0];
let best_carousel_animation_location = document.getElementsByClassName("carousel4")[0];

let best_movie = createBestMovieElement(best_movie_location);
let best_movies_elements = createImgElements(best_carousel_movies_location);
let best_action_elements = createImgElements(best_carousel_action_location);
let best_horror_elements = createImgElements(best_carousel_horror_location);
let best_animation_elements = createImgElements(best_carousel_animation_location);

showTopMovie(genre="?sort_by=-votes,-imdb_score");
bestMovies(best_movies_elements, "?sort_by=-votes,-imdb_score");
bestOtherMovies(best_action_elements, "?genre=action&sort_by=-votes,-imdb_score");
bestOtherMovies(best_horror_elements, "?genre=horror&sort_by=-votes,-imdb_score");
bestOtherMovies(best_animation_elements, "?genre=animation&sort_by=-votes,-imdb_score");
