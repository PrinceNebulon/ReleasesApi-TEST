var request = require('superagent-bluebird-promise');
var Q = require('q');

function getRepoUrl(additionalPath) {
	var url = githubReleasesApi.host + '/repos/' + githubReleasesApi.owner + '/' + githubReleasesApi.repo + '/';
	if (additionalPath)
		url += additionalPath;
	return url;
}

function logRequestSuccess(res, message) {
	console.log(
		'[INFO]' + 
		'[' + res.statusCode + ']' + 
		'[' + res.req.method + ' ' + res.req.path + '] ' + 
		(message ? message : ''));
}

function logRequestError(err) {
	console.log('[ERROR]' + 
		'[' + err.res.statusCode + ']' + 
		'[' + err.res.req.method + ' ' + err.res.req.path + '] ' + 
		err.message);
}


var githubReleasesApi = {
	/**
	 * This returns a list of releases, which does not include regular Git tags that have not been 
	 * associated with a release. To get a list of Git tags, use the Repository Tags API. Information 
	 * about published releases are available to everyone. Only users with push access will receive 
	 * listings for draft releases.
	 * @return {JSON}			A list of release data
	 */
	getRepositoryReleases: function() {
		var deferred = Q.defer();

		request
			.get(getRepoUrl('releases'))
            .set('Authorization', 'token ' + this.token)
            .then(function(res) {
            	logRequestSuccess(res);
            	deferred.resolve(res.body);
            }, 
            function(err) {
            	logRequestError(err);
            	deferred.reject(err.message);
            });

        return deferred.promise;
	},

	/**
	 * Gets data about a single release
	 * @param  {string} releaseId 	The ID of the release
	 * @return {JSON}           	The release data
	 */
	getRepositoryRelease: function(releaseId) {},

	/**
	 * View the latest published full release for the repository. Draft releases and prereleases 
	 * are not returned by this endpoint.
	 * @return {JSON}           	The release data
	 */
	getLatestRepositoryRelease: function() {},

	/**
	 * Get a published release with the specified tag.
	 * @param  {string} tag  		The tag of the release
	 * @return {JSON}           	The release data
	 */
	getRepositoryReleaseByTagName: function(tag) {},

	/**
	 * Users with push access to the repository can create a release.
	 * @param  {JSON} 	body  		A JSON document to send with the request
	 * @return {JSON}           	The release data
	 */
	createRelease: function(body) {},

	/**
	 * Users with push access to the repository can edit a release.
	 * @param  {string} releaseId 	The ID of the release
	 * @return {JSON}           	The release data
	 */
	updateRelease: function(releaseId) {},

	/**
	 * Users with push access to the repository can delete a release.
	 * @param  {string} releaseId 	The ID of the release
	 * @return {string}           	Undefined on success, otherwise an error message
	 */
	deleteRelease: function(releaseId) {},

	/**
	 * Gets a list of existing assets for a release
	 * @param  {string} releaseId 	The ID of the release
	 * @return {JSON}           	A list of asset data
	 */
	getReleaseAssets: function(releaseId) {},

	/**
	 * Upload an asset to a release
	 * @param  {string} uploadUrl 		The upload_url value from the release's data
	 * @param  {string} assetName     	The file name of the asset
	 * @param  {string} assetLabel    	An alternate short description of the asset. Used in place of the filename.
	 * @param  {string} localFilePath 	The full path to the file to be uploaded
	 * @param  {string} contentType 	The MIME type of the file (e.g. "application/zip")
	 * @return {JSON}               	The asset data
	 */
	uploadReleaseAsset: function(uploadUrl, assetName, assetLabel, localFilePath, contentType) {},

	/**
	 * Get data about a single release asset. Download the file from the URL in the 
	 * browser_download_url property.
	 * @param  {string} assetId 	The ID of the asset
	 * @return {JSON}         		The asset data
	 */
	getReleaseAssetData: function(assetId) {},

	/**
	 * Users with push access to the repository can edit a release asset.
	 * @param  {string} assetId 	The ID of the asset
	 * @param  {JSON} 	body    	A JSON document to send with the request
	 * @return {JSON}				The asset data
	 */
	updateReleaseAsset: function(assetId, body) {},

	/**
	 * Deletes an asset from a release
	 * @param  {string} assetId 	The ID of the asset
	 * @return {string}           	Undefined on success, otherwise an error message
	 */
	deleteReleaseAsset: function(assetId) {}
}

githubReleasesApi.owner = 'github_username';
githubReleasesApi.repo = 'repo_name';
githubReleasesApi.token = 'youforgottosetyourtoken';
githubReleasesApi.host = 'https://api.github.com';

// Set to window object if there is a window
if(typeof window !== 'undefined') {
    window.githubReleasesApi = githubReleasesApi;
}

// Export
module.exports = githubReleasesApi;