
export class ApiRoutes {
    createApp = '/api/v1/apps';
    getToken = '/oauth/token';
    getAccount = '/api/v1/accounts/{0}';
    getCurrentAccount = '/api/v1/accounts/verify_credentials';
    getAccountFollowers = '/api/v1/accounts/{0}/followers';
    getAccountFollowing = '/api/v1/accounts/{0}/following';
    getAccountStatuses = '/api/v1/accounts/{0}/statuses';
    follow = '/api/v1/accounts/{0}/follow';
    unfollow = '/api/v1/accounts/{0}/unfollow';
    block = '/api/v1/accounts/{0}/block';
    unblock = '/api/v1/accounts/{0}/unblock';
    mute = '/api/v1/accounts/{0}/mute';
    unmute = '/api/v1/accounts/{0}/unmute';
    getAccountRelationships = '/api/v1/accounts/relationships';
    searchForAccounts = '/api/v1/accounts/search';
    getBlocks = '/api/v1/blocks';
    getFavourites = '/api/v1/favourites';
    getFollowRequests = '/api/v1/follow_requests';
    authorizeFollowRequest = '/api/v1/follow_requests/authorize';
    rejectFollowRequest = '/api/v1/follow_requests/reject';
    followRemote = '/api/v1/follows';
    getInstance = '/api/v1/instance';
    uploadMediaAttachment = '/api/v1/media';
    getMutes = '/api/v1/mutes';
    getNotifications = '/api/v1/notifications';
    getSingleNotifications = '/api/v1/notifications/{0}';
    clearNotifications = '/api/v1/notifications/clear';
    getReports = '/api/v1/reports';
    reportUser = '/api/v1/reports';
    search = '/api/v1/search';
    getStatus = '/api/v1/statuses/{0}';
    getStatusContext = '/api/v1/statuses/{0}/context';
    getStatusCard = '/api/v1/statuses/{0}/card';
    getStatusRebloggedBy = '/api/v1/statuses/{0}/reblogged_by';
    getStatusFavouritedBy = '/api/v1/statuses/{0}/favourited_by';
    postNewStatus = '/api/v1/statuses';
    deleteStatus = '/api/v1/statuses/{0}';
    reblogStatus = '/api/v1/statuses/{0}/reblog';
    unreblogStatus = '/api/v1/statuses/{0}/unreblog';
    favouritingStatus = '/api/v1/statuses/{0}/favourite';
    unfavouritingStatus = '/api/v1/statuses/{0}/unfavourite';
    getHomeTimeline = '/api/v1/timelines/home';
    getPublicTimeline = '/api/v1/timelines/public';
    getHastagTimeline = '/api/v1/timelines/tag/{0}';
    getDirectTimeline = '/api/v1/timelines/direct';
    getTagTimeline = '/api/v1/timelines/tag/{0}';
    getListTimeline = '/api/v1/timelines/list/{0}';
    getStreaming = '/api/v1/streaming?access_token={0}&stream={1}';
}
