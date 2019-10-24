define(function () {

    var ScriptRequest = function (loadTimerName) {

        var m_load = loadTimerName;
        var m_name = "";
        var m_programName = "";
        var m_params = null;
        var m_blobIn = null;
        var m_async = true;
        var m_responseHandler = null;
        var m_timer = null;
        var m_source = null;
        var m_cacheResult = false;

        this.isCachingEnabled = function () {
            return m_cacheResult;
        };

        this.cacheResult = function (isCached) {
            m_cacheResult = isCached;
        };

        this.getLoadTimer = function () {
            return m_load;
        };
        this.setName = function (value) {
            m_name = value;
        };
        this.getName = function () {
            return m_name;
        };
        this.setProgramName = function (value) {
            m_programName = value;
        };
        this.getProgramName = function () {
            return m_programName;
        };
        this.setParameters = function (value) {
            m_params = value;
        };
        this.getParameters = function () {
            return m_params;
        };
        this.setRequestBlobIn = function (value) {
            m_blobIn = value;
        };
        this.getRequestBlobIn = function () {
            return m_blobIn;
        };
        this.setAsync = function (value) {
            m_async = value;
        };
        this.isAsync = function () {
            return m_async;
        };
        this.getSource = function () {
            return m_source;
        };
        this.setSource = function (source) {
            m_source = source;
        };
    };
    return ScriptRequest;
});
