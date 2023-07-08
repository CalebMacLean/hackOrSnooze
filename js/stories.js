"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

function isInFavorites(qStoryId) {
  if(currentUser) {
    const favorites = currentUser.favorites;
    return favorites.some(({ storyId }) => storyId === qStoryId);
  }
}

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <button class='fav-btn'> &#9829;
        </button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    if(isInFavorites(story.storyId)) {
      $(`#${story.storyId} .fav-btn`).css('color', 'red');
    }
  }

  $allStoriesList.show();
}

async function submitStory(evt) {
  evt.preventDefault();

  const titleInput = $('#story-title').val();
  const authorInput = $('#story-author').val();
  const urlInput = $('#story-url').val();
  console.log('thiss is the url text:', urlInput);
  const storyObj = {
    title: titleInput,
    author: authorInput,
    url: urlInput,
  };

  let newStory = await StoryList.addStory(currentUser, storyObj);
  
  hidePageComponents();
  getAndShowStoriesOnStart();
  updateNavOnLogin();
}

$('#story-submit-btn').on('click', submitStory);

// Function to put favorite stories on page
async function getFavorites(user) {
  const userName = user.username;
  const userToken = user.loginTokin;
  console.log('username is:', userName);
  console.log('user token is:', userToken);
  // const response = await axios.get({
  //   url: `https://hack-or-snooze-v3.herokuapp.com/users/${userName}`,
  //   method: 'GET',
  //   data: {userToken}, 
  // });

  // return response.data
  }
function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");
  
  $allStoriesList.hide();
  $('#fav-stories-list').empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $('#fav-stories-list').append($story);
    $(`#${story.storyId} .fav-btn`).css('color', 'red');
  }

  $('#fav-stories-list').show();
}

$('#nav-fav-list').on('click', putFavStoriesOnPage);

// Function Handler for adding a story to your favorites
async function favButtonHandleClick(evt) {
  evt.preventDefault();
  console.debug('favButtonHandleClick', evt);
  const parentObj = $(this).parent();
  const parentId = parentObj[0].id;
  const storyId = { storyId : parentId };

  if(isInFavorites(parentId)) {
    try {
      const deleteResponse = await currentUser.removeFromFavorites(storyId);
      $(this).parent().remove();
    } catch(err) {
      console.debug(err);
    }
  } else {
    try{
      const pushResponse = await currentUser.addToFavorites(storyId);
      $(this).css('color', 'red');
    } catch(err) {
      console.debug(err);
    }
  };
  
}

$allStoriesList.on('click', 'button', favButtonHandleClick);
$('#fav-stories-list').on('click', 'button', favButtonHandleClick);