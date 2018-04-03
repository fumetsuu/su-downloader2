## 

* [sudPath](#sudPath)

## 

* [initiateDownload(options, [number])](#initiateDownload)
* [createRequest(params)](#createRequest)
* [Request(params)](#Request)
* [startDownload(sudFile)](#startDownload)
    * [~readMeta$](#startDownload..readMeta$)
* [suDownloader()](#suDownloader)
* [setSettings(settings)](#setSettings)
* [QueueDownload(downloadOptions)](#QueueDownload)
* [startDownload(key)](#startDownload)
    * [~readMeta$](#startDownload..readMeta$)
* [startQueue()](#startQueue)
* [stopQueue()](#stopQueue)
* [pauseDownload(key)](#pauseDownload)
* [resumeDownload(key)](#resumeDownload)
* [clearDownload(key, [deleteFile])](#clearDownload)

<a name="sudPath"></a>

## sudPath
public util method to get .sud file

**Kind**: global constant  

| Param | Type |
| --- | --- |
| filepath | <code>string</code> | 

<a name="initiateDownload"></a>

## initiateDownload(options, [number])
Initiates a download, creating a new .sud file which has relevant metadata appended. Does not return anything.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.url | <code>string</code> |  | url to download |
| options.path | <code>string</code> |  | file save path (relative) |
| [number] |  | <code>4</code> | options.concurrent - number of concurrent downloads |

<a name="createRequest"></a>

## createRequest(params)
creates request object and events

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | request params object |

<a name="Request"></a>

## Request(params)
returns response and data streams

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | request params object |

<a name="startDownload"></a>

## startDownload(sudFile)
starts/resumes downloading from the specified .sud filereturns an observable that emits the progress of the download

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sudFile | <code>string</code> | existing .sud file created with initiateDownload |

<a name="startDownload..readMeta$"></a>

### startDownload~readMeta$
create file

**Kind**: inner constant of [<code>startDownload</code>](#startDownload)  
<a name="suDownloader"></a>

## suDownloader()
suDownloader

**Kind**: global function  
<a name="setSettings"></a>

## setSettings(settings)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | set downloader settings (maxConcurrentDownloads, autoQueue) |

<a name="QueueDownload"></a>

## QueueDownload(downloadOptions)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| downloadOptions | <code>object</code> | adds a download to queue, will automatically start download when queue is free if `autoQueue` is on |

<a name="startDownload"></a>

## startDownload(key)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | starts a download |

<a name="startDownload..readMeta$"></a>

### startDownload~readMeta$
create file

**Kind**: inner constant of [<code>startDownload</code>](#startDownload)  
<a name="startQueue"></a>

## startQueue()
starts the queue

**Kind**: global function  
<a name="stopQueue"></a>

## stopQueue()
stops the queue

**Kind**: global function  
<a name="pauseDownload"></a>

## pauseDownload(key)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | pauses a download |

<a name="resumeDownload"></a>

## resumeDownload(key)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | resumes a paused download |

<a name="clearDownload"></a>

## clearDownload(key, [deleteFile])
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>object</code> |  |  |
| [deleteFile] | <code>boolean</code> | <code>false</code> | whether to delete the file or just clear from queue/active |

