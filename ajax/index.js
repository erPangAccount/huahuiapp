import Load from '../load/load.js' //网络请求
const ajaxBaseUrl = "http://huahui.local.com";

const getClientTokenStorage = function() { //获取客户端访问接口token 缓存
	return uni.getStorageSync('clientToken');
}

const getUserTokenStorage = function() { //获取用户访问接口token 缓存
	return uni.getStorageSync('userToken');
}

const getToken = function() { //获取token 
	let token = {};
	if (getUserTokenStorage()) {
		token = getUserTokenStorage();
	} else {
		token = getClientTokenStorage();
	}
	
	return token;
}

const ajaxFunctions = {	//全局ajax方法
	getClientToken:  function() { //获取客户端访问token值
		Load.loadding('加载中');
		uni.request({
			method: 'POST',
			url: ajaxBaseUrl + '/oauth/token',
			dataType: 'json',
			data: {
				client_id: 3,
				client_secret: "gjaK40kMF5BzNxW7LdwOVMDag0qxLdbaRFF6ynIa",
				scope: "",
				grant_type: "client_credentials"
			},
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				uni.setStorageSync('clientToken', res.data); //把获取到的客户端访问token 放入缓存中
				Load.endLoadding();
			}
		});
	}
}

export default {
	ajaxBaseUrl: ajaxBaseUrl,
	getToken: getToken,
	ajaxFunctions: ajaxFunctions
};
