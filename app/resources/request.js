// 可以选择三种参数test,dev,prod,rap
profiles = "dev"

rap = {}
dev = {}
test = {}
prod = {}

// rap配置
rap.urlHref = "http://192.168.7.10:5031/mockjsdata/1"


// 开发配置
dev.urlHref = "http://192.168.60.2:20000"

// 测试配置
test.urlHref = "http://115.182.33.176:20000"


// 线上配置
prod.urlHref = ""



