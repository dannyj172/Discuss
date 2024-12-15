const BASE_URL = 'http://localhost:5000';

export const POST_BY_ID_URL = BASE_URL + '/api/posts/';
export const POSTS_URL = BASE_URL + '/api/posts';
export const POSTS_BY_SEARCH_URL = POSTS_URL + '/search/';
export const POSTS_BY_TOPIC_URL = POSTS_URL + '/topic/';
export const POST_CREATE_URL = POSTS_URL + '/create';
export const POST_EDIT_URL = '/edit';
export const POST_DELETE_URL = '/delete';
export const POST_COMMENT_URL = '/comment';
export const POST_COMMENT_DELETE_URL = POST_COMMENT_URL + '/delete/';
export const POST_UPVOTE_URL = '/upvote';
export const POST_DOWNVOTE_URL = '/downvote';
export const POSTS_BY_USER_URL = POSTS_URL + '/all/';

export const TOPICS_URL = BASE_URL + '/api/topics';
export const TOPIC_BY_TOPICNAME_URL = TOPICS_URL + '/';
export const TOPIC_POSTS_AMOUNT_CHANGE_URL = TOPICS_URL + '/postAmountChange/';

export const USER_URL = BASE_URL + '/api/users';
export const USER_LOGIN_URL = USER_URL + '/login';
export const USER_REGISTER_URL = USER_URL + '/register';
export const USER_DETAILS_URL = USER_URL + '/profile/';
