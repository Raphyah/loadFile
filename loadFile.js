//loadFile.js
//Created by Leonardo Santos
//A library for quickly loading files to project
/*--JSON5 & loadFile.js--
	JSON5 support for loadFile.JSON()
	Insert JSON5 library to your project first and loadFile.json will automatically JSON5.parse() it when loadFile.JSON() is evoked.
	Note: You need to insert JSON5 library manually to HTML file in order to avoid library error. Unnatural behaviour may happen if you call JSON5 using loadFile.SCRIPT().
	Find out more about JSON5 here https://json5.org/
*/
/*--Known issues--
	Try to avoid using custom Vocabs within loadFile.setLang() (eg.: custom, custom-CUSTOM, etc). It may fail sometimes, when loadFile.js loads a file before loadFile.setLang() defines the Vocab.
*/
var Vocab={0:"Network error",100:"Continue",101:"Switching Protocols",103:"Checkpoint",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",306:"Switch Proxy",307:"Temporary Redirect",308:"Resume Incomplete",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request-URI Too Long",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",511:"Network Authentication Required",m:["Error","when attempting to open"]};
const loadFile={
	setLang:function(defineLang,afterload){
		let lang=defineLang;
		let requestXML=new XMLHttpRequest();
		if (defineLang=="auto"||defineLang==undefined)lang=navigator.language;
		requestXML.open("get","loadFileJS/lang/"+lang+".json");
		requestXML.responseType="text";
		requestXML.send();
		requestXML.onreadystatechange=function(){
			if(requestXML.readyState===4){
				if(requestXML.status===200){
					Vocab=JSON.parse(requestXML.response);
					window[afterload]();
				}else{
					alert(lang+" not found.");
				}
			}
		}
	},
	search:function(path, afterload, arg){
		try{
			let requestXML=new XMLHttpRequest();
			requestXML.open("get",path);
			requestXML.send();
			requestXML.onreadystatechange=function(){
				if(requestXML.readyState===4){
					if(requestXML.status===200){
						window[afterload](arg);
					}else{
						document.body.innerHTML=`<p style="font-size:32px;text-align:center;">${Vocab.m[0]} ${requestXML.status}<br/>${Vocab[requestXML.status]}</p>`;
					}
				}
			};
		}catch(error){
			alert("Unable to return file.\r\n"+error);
		}
	},
	JSON:function(path, afterload, arg){
		try{
			let requestXML=new XMLHttpRequest();
			requestXML.open("get",path);
			requestXML.responseType="text";
			requestXML.send();
			requestXML.onreadystatechange=function(){
				if(requestXML.readyState===4){
					if(requestXML.status===200){
						if(typeof JSON5=="undefined"){
							let xmlResponse=JSON.parse(requestXML.response);
							window[afterload](xmlResponse, arg);
						}else{
							let xmlResponse=JSON5.parse(requestXML.response);
							window[afterload](xmlResponse,arg);
						}
					}else{
						document.body.innerHTML+=`<p style="font-size:32px !important;text-align:center !important;">${Vocab.m[0]} ${requestXML.status}<br/>${Vocab[requestXML.status]} ${Vocab.m[1]} ${path}</p>`;
					}
				}
			}
		}catch(error){
			alert("Unable to return JSON file.\r\n"+error);
		}
	},
	SCRIPT:function(path,appendTo,afterload,type){
		try{
			let requestXML=new XMLHttpRequest();
			requestXML.open("get",path);
			requestXML.responseType="text";
			requestXML.send();
			requestXML.onreadystatechange=function(){
				if(requestXML.readyState===4){
					if(requestXML.status===200){
						let script=document.createElement("script");
						if(type!=undefined)script.setAttribute("type",type);
						script.innerHTML=requestXML.response;
						document[appendTo].appendChild(script);
						if(afterload!=undefined){
							if(Array.isArray(afterload)==true){
								for(let x=0;x<afterload.length;x++){
									window[afterload[x]]();
								}
							}else{
								window[afterload]();
							}
						}
					}else{
						document.body.innerHTML+=`<p style="font-size:32px !important;text-align:center !important;">${Vocab.m[0]} ${requestXML.status}<br/>${Vocab[requestXML.status]} ${Vocab.m[1]} ${path}</p>`;
					}
				}
			}
		}catch(error){
			alert("Unable to return script file.\r\n"+error);
		}
	},
	STYLE:function(path,type){
		try{
			let requestXML=new XMLHttpRequest();
			requestXML.open("get",path);
			requestXML.responseType="text";
			requestXML.send();
			requestXML.onreadystatechange=function(){
				if(requestXML.readyState===4){
					if(requestXML.status===200){
						let style=document.createElement("style");
						if(type!=undefined)style.setAttribute("type",type);
						style.innerHTML=requestXML.response;
						document["head"].appendChild(style);
					}else{
						document.body.innerHTML+=`<p style="font-size:32px !important;text-align:center !important;">${Vocab.m[0]} ${requestXML.status}<br/>${Vocab[requestXML.status]} ${Vocab.m[1]} ${path}</p>`;
					}
				}
			}
		}catch(error){
			alert("Unable to return style file.\r\n"+error);
		}
	}
};