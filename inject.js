console.log("注入页面")
var confirmed = false
var feeding = false
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        console.log("页面发生变化")
        setTimeout(function () {
            $("div").forEach(element => {
                if ($(element).hasClass("monkeys")) {
                    $(element).find(".panel").forEach(monkey => {
                        console.log(monkey)
                        var percent = $(monkey).find(".info").first().find(".percent").first().text()
                        var btn = $('<button>最大次数喂养</button>')
                        btn.click(function () {
                            if (feeding) {
                                alert("请等待上一只喂养完成!")
                                return
                            }
                            if (!confirmed) {
                                if (!confirm("喂养一只猴子需要向作者转账0.5WKC请确认")) {
                                    return
                                }
                                confirmed = true
                            }

                            feeding = true
                            var self = $(this);
                            self.hide()
                            chrome.extension.sendRequest({
                                id: $(monkey).find(".id").first().text().split(' ')[1],
                                limit: Number((percent.split('/')[1] - percent.split('/')[0]).toFixed(2)),
                                mode: "slow",
                            }, function (response) {
                                console.log(response);
                                feeding = false
                            });
                        })
                        var btn2 = $('<button>最少次数喂养</button>')
                        btn2.click(function () {
                            if (feeding) {
                                alert("请等待上一只喂养完成!")
                                return
                            }
                            if (!confirmed) {
                                if (!confirm("喂养一只猴子需要向作者转账0.5WKC请确认")) {
                                    return
                                }
                                confirmed = true
                            }
                            feeding = true
                            var self = $(this);
                            self.hide()
                            chrome.extension.sendRequest({
                                id: $(monkey).find(".id").first().text().split(' ')[1],
                                limit: Number((percent.split('/')[1] - percent.split('/')[0]).toFixed(2)),
                                mode: "quick",
                            }, function (response) {
                                console.log(response);
                                feeding = false
                            });
                        })
                        console.log("has button", $(monkey).has("button").length)
                        if ($(monkey).find("button").length == 0) {
                            $(monkey).append(
                                btn
                            )
                            $(monkey).append(
                                btn2
                            )
                        }

                    })
                }
                if ($(element).hasClass("item")) {
                    var info = $($(element).find(".info p").get(1)).text()
                    var priceDiv = $(element).find(".price span").first()
                    var price = $($(element).find(".price span").get(0)).text()
                    if (!info || !priceDiv || !price) {
                        return
                    }
                    var kg = info.split('·')[1].split(' ')[0]
                    var arg1 = info.split('·')[0].split('/')[0]
                    var arg2 = info.split('·')[0].split('/')[1]
                    var arg3 = info.split('·')[0].split('/')[2]
                    var wkc = price.split(' ')[0]
                    var span = $($(element).find(".price").find(".price span").get(0))
                    if (span.text().indexOf(";") !== -1) {
                        wkc = span.text().split(';')[0]
                    }
                    console.log(request.mode, request.min)
                    var mark = arg1 * arg3 * (request.kg == "true" ? kg : 1);
                    var showMark = request.mode == "value" ? mark : mark / wkc
                    span.text(wkc + ";" + (showMark).toFixed(5))
                    if (showMark >= request.min) {
                        $(element).prop("style", "background:#F00;")
                    }
                }
            });
        }, 1000)
        sendResponse({})
    });

