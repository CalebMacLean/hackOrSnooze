"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  // show() is a jQuery Method
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $('#nav-fav-list').show();
  $navAddStory.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Event Handler for pulling up the submit story form
function navShowStoryForm(evt) {
  console.debug("navAddStory", evt);
  hidePageComponents();
  $storyForm.show();
}

$navAddStory.on('click', navShowStoryForm);

// Event Handler for showing the user's favorite stories
function navShowFavStories(evt) {
  console.debug("navShowFavStories", evt);
  hidePageComponents();
  putFavStoriesOnPage();
} 

$('#nav-fav-list').on('click', navShowFavStories);