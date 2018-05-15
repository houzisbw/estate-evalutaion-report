/**
 * 正式报告的服务端路由
 */
var express = require('express');
var mime = require('mime');
//获取文件上传中间处理模块
var multiparty = require('connect-multiparty')
//获取node文件处理模块,node自带的，不用npm安装
var fs = require('fs');
var path = require('path');
//解压缩
var admZip = require('adm-zip');
//路由
var router = express.Router();

//上传正报对应的预评估报告
router.post('/getPreReportDocx',multiparty(),function(req,res,next){
	//获得文件名,注意此处的wordPre是前端设置的name字段值
	var filename = req.files.wordPreReport.originalFilename || path.basename(req.files.wordPreReport.path);
	//复制文件到指定路径(预评估存放文件夹)
	var targetPath = './../public/tempFiles/tempPreReportFile/' + filename;
	var fileReadStream = fs.createReadStream(req.files.wordPreReport.path);
	var fileWriteStream = fs.createWriteStream(targetPath);
	var fullPath = path.join(__dirname,targetPath);
	//复制文件到指定目录保存
	fileReadStream.pipe(fileWriteStream);
	//文件写入完成，异步操作,注意错误处理，防止崩溃
	let resultList = [];
	fileWriteStream.on('close',function(){
		//解压缩
		const zip = new admZip(fullPath);
		//将document.xml(解压缩后得到的文件)读取为text内容
		let contentXml = zip.readAsText("word/document.xml");
		//正则匹配出对应的<w:p>里面的内容,方法是先匹配<w:p>,再匹配里面的<w:t>,将匹配到的加起来即可
		//注意？表示非贪婪模式(尽可能少匹配字符)，否则只能匹配到一个<w:p></w:p>
		var matchedWP = contentXml.match(/<w:p.*?>.*?<\/w:p>/gi);
		//继续匹配每个<w:p></w:p>里面的<w:t>,这里必须判断matchedWP存在否则报错
		if(matchedWP){
			matchedWP.forEach(function(wpItem){
				//注意这里<w:t>的匹配，有可能是<w:t xml:space="preserve">这种格式，需要特殊处理
				let matchedWT = wpItem.match(/(<w:t>.*?<\/w:t>)|(<w:t\s.[^>]*?>.*?<\/w:t>)/gi);
				let textContent = '';
				if(matchedWT){
					matchedWT.forEach(function(wtItem){
						//如果不是<w:t xml:space="preserve">格式
						if(wtItem.indexOf('xml:space')===-1){
							textContent+=wtItem.slice(5,-6);
						}else{
							textContent+=wtItem.slice(26,-6);
						}
					});
					//如果是空白也要在最终输出中占位,但是如果word中表格完全没内容(不是空格)则匹配不到
					let tempContent = textContent.trim();
					resultList.push(tempContent===''?'[--无内容--]':tempContent)
				}
			});
		}
		//如果存在则删除文件
		fs.exists(fullPath,function(isExist) {
			if (isExist) {
				//进行删除操作
				fs.unlink(fullPath)
			}
		});
		//服务端回应,前端对应done事件
		res.json({
			status:1,
			data:resultList
		})
	})



});



module.exports = router
