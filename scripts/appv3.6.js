function notificationController(n, t, e, a, i) {
    var o = this;
    e.$onAuthStateChanged(function(e) {
        var s;
        e ? (o.notification = t(a().child("notification")), s = o.notification.$watch(function(t) {
            null !== o.notification.$value && (n.open({
                component: "modalNotify",
                size: "edit",
                animation: !1,
                windowClass: "animation-modal-x",
                resolve: {
                    notification: function() {
                        return o.notification
                    }
                }
            }).result.then(function() {
                o.notification.$remove()
            }, function(n) {
                console.error("Error receiving notification: ", n), o.notification.$remove()
            }), i.log("payment", "Paid"))
        })) : (s && s(), o.notification && o.notification.$destroy())
    })
}

function ThemeController(n, t, e) {
    var a = this;
    a.$onInit = function() {
        a.theme = n.theme, a.themes = t.themes
    }, a.changeTheme = function(t) {
        a.theme = t, n.theme = t, e.setRuntimeOpt("theme", t), a.close(), Analytics.log("customize", "Theme Changed", t)
    }
}

function SurveyController(n, t) {
    var e = this;
    e.select = function(a) {
        t.log("survey", a), localStorage.setItem("survey." + e.resolve.surveyId, Date.now()), e.dismiss(), "Planning Event" === a && n.go("register")
    }
}

function RegisterController(n, t, e, a, i, o) {
    var s = this;
    s.$onInit = function() {
        s.analytics = o, s.newsletter = !0
    }, s.register = function() {
        s.loading || (s.loading = !0, e.$createUserWithEmailAndPassword(s.email, s.password).then(function(n) {
            return o.id("alias", n.uid, n.email), n.updateProfile({
                displayName: s.company,
                contactPhone: s.phone
            })
        }).then(function() {
            o.log("register", "Done", "Email"), t.post(a.api.welcome, {
                contact_email: s.email,
                contact_name: s.company,
                newsletter: s.newsletter,
                language: i.getLang()
            }), s.loading = !1, s.company = s.email = s.password = null, n.go("customize")
        })["catch"](function(n) {
            s.loading = !1, s.error = n.message + " (code: " + n.code + ")", o.log("register", "Fail", n.message)
        }))
    }
}

function PrizeController(n, t, e, a, i, o) {
    var s = this;
    s.$onInit = function() {
        s.ux = i, s.allPrizes = e.load(n.member.setting, 9999).reverse(), s.editing = n.editing, s.setting = n.member.setting, s.prizes = {}, s.enabled_prizes = {}, angular.copy(n.member.setting.prizes, s.prizes), angular.copy(n.member.setting.enabled_prizes, s.enabled_prizes), s.iconchanged = s.namechanged = s.loading = !1
    }, s.save = function(t) {
        if (!s.loading) {
            if (!s.namechanged) return s.iconchanged || o.log("ui_action", "Edit Without Changes", "Prizes"), void s.doDismiss();
            s.loading = !0;
            var e = !0;
            for (var i in s.enabled_prizes) "i" !== i && s.enabled_prizes[i] && (e = !1);
            e && (s.enabled_prizes.x = !0), n.member.setting.prizes = {}, n.member.setting.enabled_prizes = {}, "reset" !== t && (angular.copy(s.prizes, n.member.setting.prizes), angular.copy(s.enabled_prizes, n.member.setting.enabled_prizes)), n.save("setting", "prizes").then(function(n) {
                s.close(), "reset" === t ? o.log("customize", "Prizes Name Reseted") : o.log("customize", "Prizes Name Edited", Object.keys(s.enabled_prizes).length - 1), a("customize", "reload")
            }, function(n) {
                s.loading = !1
            })
        }
    }, s.reset = function() {
        s.namechanged = !0, s.prizes = {}, s.enabled_prizes = {}, e.enable_default(s.enabled_prizes), s.save("reset")
    }, s.removeIcon = function(t) {
        s.iconchanged = !0, n.remove("icons", t), o.log("customize", "Prize Icon Delete", t)
    }, s.uploadIcon = function(t, e) {
        s.iconchanged = !0, n.upload(t, "Prize", "icons", e), o.log("customize", "Prize Icon Upload", e)
    }, s.doDismiss = function() {
        s.dismiss(), s.iconchanged && a("customize", "reload")
    }
}

function PaymentController(n, t, e, a, i, o, s, r, l) {
    var c = this;
    c.$onInit = function() {
        c.modals = e, c.user = a, c.dismissCountDown = null;
        var n = i.getLang();
        o.local[n] || (n = s.runtime.language);
        var t = o.local[n] + "-payment-form",
            u = "<" + t + "></" + t + ">",
            d = l.$new(!0, l);
        $("div#payment-form").html(r(u)(d))
    }
}

function PaymentIntroController(n, t) {
    var e = this;
    e.$onInit = function() {
        e.appState = n.current, e.user = t
    }
}

function PaymentButtonController(n) {
    var t = this;
    t.$onInit = function() {
        t.user = n
    }
}

function PaypalPaymentController(n, t, e, a, i, o, s, r, l) {
    var c = this;
    c.$onInit = function() {
        var e = a.$getAuth() || {};
        c.email = e.email, c.custom = e.uid, c.paypal = r.provider.paypal, c.paypal.action = n.trustAsResourceUrl(c.paypal.url), c["package"] = "event1day", c.modals = l, c.appState = t.current, c.userService = o, c.user = s, c.timingStart = Date.now() + 6e5, c.times = r.times
    }, c.submit = function() {
        r.loadingIcon(!0), i.log("payment", "Init", "Paypal")
    }
}

function SohaPaymentController(n, t, e, a, i, o, s, r) {
    var l = this;
    l.$onInit = function() {
        var t = e.$getAuth() || {};
        l.uid = t.uid, l.email = t.email, l.soha = s.provider.soha, l.paymentGuide = l.soha.ps + " Payment Guide", l["package"] = "event1day", l.modals = r, l.appState = n.current, l.userService = i, l.user = o, l.timingStart = Date.now() + 6e5, l.times = s.times
    }, l.submit = function() {
        function n(n) {
            window.$luckydraw.error = n, s.loadingIcon(!1), r.alert("", "Unable to init payment process. Please try again."), a.log("error", "Init Payment - Soha", n)
        }
        s.loadingIcon(!0), a.log("payment", "Init", "Soha"), window.$luckydraw = window.$luckydraw || {}, window.$luckydraw.initPayment = {
            uid: l.uid,
            contact_email: l.email,
            "package": l["package"]
        }, t.post(s.provider.soha.url, window.$luckydraw.initPayment).then(function(t) {
            window.$luckydraw.initSoha = t.data, t.data.url ? window.location.href = t.data.url : n("response.data.url is null")
        })["catch"](n)
    }
}

function NotifyController() {
    var n = this;
    n.$onInit = function() {
        n.notification = n.resolve.notification
    }
}

function MessageController(n, t) {
    var e = this;
    e.$onInit = function() {
        e.messages = {}, angular.copy(n.member.setting.messages, e.messages)
    }, e.save = function(a) {
        if (!e.loading) {
            if (!e.datachanged) return e.close(), void t.log("ui_action", "Edit Without Changes", "Action Messages");
            e.loading = !0, n.member.setting.messages = {}, angular.copy(e.messages, n.member.setting.messages), n.save("setting", "messages").then(function(n) {
                e.close(), "reset" === a ? t.log("customize", "Action Messages Reseted") : t.log("customize", "Action Messages Edited")
            }, function(n) {
                e.loading = !1
            })
        }
    }, e.reset = function() {
        e.datachanged = !0, e.messages = {}, e.save("reset")
    }
}

function LoginController(n, t, e) {
    var a = this;
    a.$onInit = function() {
        a.analytics = e
    }, a.login = function() {
        a.loading || (a.loading = !0, t.$signInWithEmailAndPassword(a.email, a.password).then(function(t) {
            e.id("identify", t.uid, t.email), e.log("login", "Logged In"), a.email = a.password = null, n.go("customize")
        })["catch"](function(n) {
            a.loading = !1, a.error = n.message + " (code: " + n.code + ")", e.log("login", "Fail to Login", n.message)
        }))
    }, a.loginGoogle = function() {
        a.loading = !0;
        var n = new firebase.auth.GoogleAuthProvider;
        n.addScope("https://www.googleapis.com/auth/plus.login"), firebase.auth().signInWithRedirect(n)
    }
}

function LanguageController(n, t) {
    var e = this;
    e.$onInit = function() {
        e.language = n.getLang(), e.languages = n.languages
    }, e.changeLanguage = function(a) {
        e.language = a, n.setLang(a), t.log("customize", "Language Changed", a), e.close()
    }
}

function IntroController(n) {
    var t = this;
    t.$onInit = function() {
        t.modals = n
    }
}

function IdsResultController(n, t, e, a, i, o, s, r, l, c) {
    var u = this;
    u.$onInit = function() {
        u.defaultTab = i.currentTab, u.state = n.current.name, !l.authenticated || "presentation" != u.state && "customize" != u.state ? (u.custom_prizes = [], u.prizes = i.load(s, !1), u.results = a.load("default")) : (u.custom_prizes = o.member.setting.prizes, u.prizes = i.load(o.member.setting, !1), u.results = a.load(u.state, e.sessionId, "array"), t(function() {
            u.resultsLoaded = !0
        }, 3e3)), u.toggleDel = {}, u.gotLengths = [], u.batchStops = {}
    }, u.deleteResult = function(n, t) {
        a.clear(n.$id, t.key)
    }, u.getIndex = function(n, t, e, a) {
        var i = t + e;
        return u.gotLengths[i] || (u.gotLengths[i] = n.length || Object.keys(n).length), u.gotLengths[i] - a
    }, u.rowStyle = function(n, t, e) {
        var a, i;
        return void 0 === u.batchStops[n] && (u.custom_prizes[n] && (a = u.custom_prizes[n].match(/\([xX][0-9]+\)$/g)), u.batchStops[n] = a ? parseInt(a[0].substr(2).slice(0, -1)) : 0), u.batchStops[n] > 1 && (i = t % u.batchStops[n] === 0 ? "even" : "odds", "presentation" === u.state && t >= u.batchStops[n] && (i += " hidden")), e + " " + i
    }, u.download = function() {
        var n = [],
            t = [r.instant("Drawing Session"), r.instant("Prize"), r.instant("IDs"), r.instant("Winner Name"), r.instant("Draw Date"), r.instant("Status")];
        n.push(t);
        var e = 0;
        angular.forEach(u.results, function(a, i) {
            e++, angular.forEach(u.prizes, function(i) {
                angular.forEach(a[i.key], function(a) {
                    t = [e, u.custom_prizes[i.key] || r.instant(i.name), a.id, a.name, moment(a.time).format("YYYY-MM-DD HH:mm:ss"), r.instant(a.status)], n.push(t)
                })
            })
        });
        var a = new ExcelPlus,
            i = "LuckyDraw-" + moment(Date.now()).format("YYYYMMMDD-HHmmss") + ".xlsx";
        return a.createFile("LuckyDraw").write({
            content: n
        }).saveAs(i), c.log("ui_action", "Id Result Download", n.length - 1), !1
    }
}

function IdController(n, t, e, a, i) {
    var o = this;
    o.$onInit = function() {
        o.start = 1, o.end = 20, o.data = e.member.data, o.ids = [], o.names = [], angular.copy(o.data.ids, o.ids), angular.copy(o.data.names, o.names), o.loading = o.datachanged = o.maxLength = !1, o.currentIdLen = o.longestIdLen = e.member.setting.runtime.longestIdLen || 0
    }, o.save = function(n) {
        if (!o.loading) {
            if (!o.datachanged) return void(n ? o.ids && o.ids.length > 0 ? (o.close(), i.log("ui_action", "Go Presentation", "From Modal Id"), t("presentation")) : i.log("ui_action", "Fail to Go Presentation", "Ids Empty") : (o.close(), i.log("ui_action", "Edit Without Changes", "Data Ids")));
            if (o.checkMaxLength(), o.maxLength) return void i.log("customize", "Fail to Save Data Ids", "Id Max Length: " + o.longestIdLen + "/" + a.maxLengthId);
            o.loading = !0, o.data.ids = [], o.data.names = [], angular.copy(o.ids, o.data.ids), angular.copy(o.names, o.data.names), e.member.setting.runtime.longestIdLen = o.longestIdLen, e.save("data", "ids").then(function(a) {
                o.ids.length > 0 ? i.log("customize", "Data Ids Saved", o.ids.length, {
                    names: o.names.length
                }) : i.log("customize", "Data Ids Emptied"), e.save("setting", "longestIdLen").then(function(e) {
                    o.ids.length > 0 ? (o.close(), n ? (i.log("ui_action", "Go Presentation", "From Modal Id"), t("presentation")) : o.longestIdLen !== o.currentIdLen && t("customize", "reload")) : (o.loading = !1, o.datachanged = !1, n && i.log("ui_action", "Fail to Go Presentation", "Ids Empty"))
                }, function(n) {
                    o.loading = !1
                })
            }, function(n) {
                o.loading = !1
            })
        }
    }, o.generate = function(n, t) {
        if (o.datachanged = !0, n = parseInt(n), t = parseInt(t), n || (n = 1), t || (t = 20), n > t) {
            var e = n;
            n = t, t = e
        }
        o.start = n, o.end = t, o.ids = _.range(n, t + 1).map(function(n) {
            return _.padStart(n, 6, "0")
        }), i.log("customize", "Data Ids Generated", n + " - " + t)
    }, o.checkMaxLength = function() {
        o.maxLength = !1, o.longestIdLen = 0, o.ids || (o.ids = []), o.names || (o.names = []), angular.forEach(o.ids, function(n) {
            n = String(n).replace(/\s+/g, "");
            var t = n.match(/^(.*)\*(x|diamond|gold|silver|bronze|p[0-9]+)$/i);
            t && 3 === t.length && (n = t[1]), !o.maxLength && n.length > a.maxLengthId && (o.maxLength = !0), n.length > o.longestIdLen && (o.longestIdLen = n.length)
        })
    }
}

function ForgotPasswordController(n, t, e) {
    var a = this;
    a.analytics = e, a.forgotPassword = function() {
        a.loading || (a.loading = !0, n.$sendPasswordResetEmail(a.email).then(function() {
            t.alert("Done", "Please check your email for reset password instruction"), a.close(), e.log("forgotpw", "Reset Password Submitted")
        })["catch"](function(n) {
            a.loading = !1, a.error = n.message + " (code: " + n.code + ")", e.log("forgotpw", "Fail to Reset Password", n.message)
        }))
    }
}

function ContactController(n, t, e, a) {
    var i = this;
    i.$onInit = function() {
        i.modals = t
    }, i.submit = function() {
        i.loading || (i.loading = !0, n.post(e.api.contact, i.data).then(function() {
            i.close(), i.modals.alert("Done", "Your message has been sent successfully to LuckyDraw team!"), a.log("contact", "Contact Form Submitted")
        })["catch"](function(n) {
            i.dismiss(), i.modals.alert("", "Unable to send your message"), a.log("error", "Submitting Contact Form", n)
        }))
    }
}

function ButtonController(n, t) {
    var e = this;
    e.$onInit = function() {
        e.buttons = {}, angular.copy(n.member.setting.buttons, e.buttons)
    }, e.save = function(a) {
        if (!e.loading) {
            if (!e.datachanged) return e.close(), void t.log("ui_action", "Edit Without Changes", "Buttons");
            e.loading = !0, n.member.setting.buttons = {}, angular.copy(e.buttons, n.member.setting.buttons), n.save("setting", "buttons").then(function(n) {
                e.close(), "reset" === a ? t.log("customize", "Buttons Reseted") : t.log("customize", "Buttons Edited")
            }, function(n) {
                e.loading = !1
            })
        }
    }, e.reset = function() {
        e.datachanged = !0, e.buttons = {}, e.save("reset")
    }
}

function BackgroundController(n, t, e, a, i, o, s) {
    var r = this;
    r.$onInit = function() {
        r.user = a, r.modals = o, r.user.authenticated ? (r.editing = i.editing, r.info = i.member.setting.info) : (r.editing = {
            infobackground: !1
        }, r.info = {
            background: null
        })
    }, r.removeBackground = function() {
        i.remove("info", "background"), t(function() {
            n.background = "", n.url_background = ""
        }), s.log("customize", "Background Delete")
    }, r.uploadBackground = function(t) {
        if (!r.editing.infobackground) {
            r.uploadProgress = 0;
            var a = e(function() {
                r.uploadProgress < 100 && r.uploadProgress++
            }, 300);
            s.log("customize", "Background Uploading"), i.upload(t, "Background", "info", "background").then(function(t) {
                n.background = t, e.cancel(a), a = void 0, s.log("customize", "Background Uploaded")
            }, function(n) {
                e.cancel(a), a = void 0
            })
        }
    }
}

function AlertController(n, t) {
    var e = this;
    e.$onInit = function() {
        if (e.dismissCountDown = null, e.resolve.dismissLogout) {
            e.dismissCountDown = -9;
            var a = t(function() {
                e.dismissCountDown++, 0 === e.dismissCountDown && (t.cancel(a), a = void 0, e.dismiss(), n.logout())
            }, 1e3)
        }
    }
}

function AccountController(n, t, e, a, i, o, s) {
    var r = this;
    r.$onInit = function() {
        r.auth = e.$getAuth(), r.ux = o, r.user = a, r.member = a.member.membership, r.modals = t, r.version = i.version, r.datachanged = r.edit = r.saving = !1
    }, r.updateProfile = function() {
        return r.datachanged ? void(r.saving || (r.saving = !0, r.auth.updateProfile({
            displayName: r.company
        }).then(function() {
            n.$apply(function() {
                r.datachanged = r.edit = r.saving = !1, s.log("edit_profile", "Company Name Changed")
            })
        }, function(t) {
            n.$apply(function() {
                r.datachanged = !0, r.edit = !0, r.saving = !1
            }), s.log("error", "Changing Company Name", t)
        }))) : (r.edit = r.saving = !1, void s.log("ui_action", "Edit Without Changes", "User Profile - Company"))
    }, r.updatePassword = function() {
        if (!r.loading) {
            r.loading = !0;
            var n = firebase.auth.EmailAuthProvider.credential(r.auth.email, r.password);
            r.auth.reauthenticate(n).then(function() {
                r.rePassword != r.newPassword ? (r.loading = !1, r.error = "Password does not match the confirm password", s.log("edit_profile", "Fail to Change Password", "Passwords not match")) : e.$updatePassword(r.newPassword).then(function() {
                    r.loading = !1, r.success = "Your password has been changed successfully", s.log("edit_profile", "Password Changed")
                })["catch"](function(n) {
                    r.loading = !1, r.error = n.message, s.log("error", "Changing Password", n.message)
                })
            }, function(n) {
                console.error("Error reauthenticate: ", n), r.loading = !1, r.error = n.message, s.log("error", "Changing Password - Reauthenticating", n.message)
            })
        }
    }
}

function IdLuckyDrawController(n, t, e, a, i, o, s, r, l, c) {
    var u = this;
    u.$onInit = function() {
        if (u.appState = n.current, u.ankey = "presentation" == u.appState.name ? "iddraw_pres" : "iddraw_home", u.defaultSetting = a, u.prizes = o.load(u.setting, !0), u.user = s, u.user.checkin(), u.ux = r, u.analytics = l, u.animClass = {}, u.ids = [], u.selectedIds = [], u.names = [], u.idChars = [], u.longestIdLen = 3, u.structured = {
                nan: []
            }, angular.forEach(u.data.ids, function(n, t) {
                n = String(n).replace(/\s+/g, "");
                var e = "nan",
                    a = n.match(/^(.*)\*(x|diamond|gold|silver|bronze|p[0-9]+)$/i);
                if (a && 3 === a.length && (n = a[1], e = a[2], u.structured[e] || (u.structured[e] = [])), !(u.ids.indexOf(n) >= 0)) {
                    n.length > u.longestIdLen && (u.longestIdLen = n.length), u.idChars = _.uniq(_.concat(u.idChars, n.split(""))), u.ids.push(n);
                    var i = "";
                    u.data.names && (i = u.data.names[t] || ""), u.names.push(i.trim()), u.structured[e].push(u.ids.length - 1)
                }
            }), u.idChars.length < 9)
            for (var t = 0; t < i.checkChars.length; t++) {
                var e = new RegExp(i.checkChars[t].regexp);
                u.idChars[0].match(e) && (u.idChars = _.uniq(_.concat(u.idChars, i.checkChars[t].chars.split(""))), t = i.checkChars.length)
            }
        var d = {};
        u.totalResults = 0, angular.forEach(u.results, function(n, t) {
            d[t] = 0, angular.forEach(n, function(n) {
                u.selectedIds.push(n.id), "Rejected" !== n.status && d[t]++, u.totalResults++;
                var e = u.ids.indexOf(n.id);
                for (var a in u.structured) {
                    var i = u.structured[a].indexOf(e);
                    i !== -1 && u.structured[a].splice(i, 1)
                }
            })
        });
        for (var t = 0; t < u.prizes.length; t++) {
            var g = u.prizes[t].key;
            d[g] && (u.prizes[t].confirmed = d[g])
        }
        u.machineSlots = _.range(0, u.longestIdLen), u.slotsCss = i.slotsCss(u.longestIdLen), c.init(u.longestIdLen), u.characters = [], u.machines = [], u.state = i.states.ready
    }, u.setPrize = function(n) {
        if (u.state === i.states.ready) {
            if (n < 0 || n >= u.prizes.length) return void c.play("na");
            u.state = i.states.setprize, u.prizeIndex >= 0 && (c.play("setPrize"), c.stop("turnonSlots"), c.stop("actionButtons")), u.ux.mLeave("prevnext"), n < u.prizeIndex ? u.animClass.setprize = "prize-prev" : u.prizeIndex >= 0 && (u.animClass.setprize = "prize-next"), o.currentTab = n, u.prizeIndex = n, u.prize = u.prizes[n];
            var e = u.structured[u.prize.key];
            if (e && e.length)
                for (var a = 0; a < e.length; a++) u.selectedIds.indexOf(u.ids[e[a]]) !== -1 && (e.splice(a, 1), a--);
            t(function() {
                c.play("turnonSlots", 150), u.animClass.setprize = null, u.state = i.states.ready, c.play("actionButtons", 1e3), c.stop("setPrize")
            }, i.timeout.ready), u.animClass.setprize && l.log(u.ankey, "Set Prize", u.prize.key)
        }
    }, u.setPrevPrize = function() {
        u.setPrize(u.prizeIndex - 1)
    }, u.setNextPrize = function() {
        u.setPrize(u.prizeIndex + 1)
    }, u.createMachines = function(n) {
        if (!u.machines || !u.machines.length) {
            u.characters = [];
            for (var e = 0; e < u.longestIdLen; e++) {
                var a = _.shuffle(u.idChars).map(function(n) {
                    return String(n)
                });
                a.unshift(" "), u.characters.push(a)
            }
            t(function() {
                u.machines = [], u.machinesDelay = [], $(".slots .slot").each(function(t, e) {
                    u.machinesDelay[t] = _.random(i.mdelay.min, i.mdelay.max), u.machines[t] = $(e).slotMachine({
                        active: u.characters[t].indexOf(i.favNum),
                        delay: u.machinesDelay[t],
                        direction: i.spinDirection
                    }), n && (u.machines[t].shuffle(), c.play("spinHigh" + t, 144 * t + 233, "loop"))
                })
            })
        }
    }, u.shuffleMachines = function() {
        angular.forEach(u.machines, function(n, t) {
            n.shuffle(), c.play("spinHigh" + t, 144 * t + 233, "loop")
        })
    }, u.destroyMachines = function() {
        angular.forEach(u.machines, function(n, t) {
            n.stop(), n.destroy()
        }), u.machines = null, u.characters = null
    }, u.startstop = function() {
        var n, t;
        u.state == i.states.ready ? u.spin() : u.state == i.states.spin && (u.setting.prizes[u.prize.key] ? n = u.setting.prizes[u.prize.key].match(/\([xX][0-9]+\)$/g) : "presentation" !== u.appState.name && u.defaultSetting.prizes[u.prize.key] && (n = u.defaultSetting.prizes[u.prize.key].match(/\([xX][0-9]+\)$/g)), t = n ? parseInt(n[0].substr(2).slice(0, -1)) : 0, t > 1 ? u.stopBatch(t) : u.stop())
    }, u.spin = function() {
        if (!m() && u.state === i.states.ready) {
            var n = u.structured[u.prize.key] && u.structured[u.prize.key].length;
            if (u.prize.skey = n ? u.prize.key : "nan", !n && !u.structured.nan.length) return void e.alert("", "Everybody Win!");
            u.state = i.states.tospin, c.play("start"), c.pause("background"), c.play("spinHigh", 0, "loop"), u.ux.mLeave("spin"), u.iAIDs = u.id = u.name = null, u.machines && u.machines.length ? u.shuffleMachines() : u.createMachines(!0), "presentation" == u.appState.name && (u.lightOff = !0), t(function() {
                u.state = i.states.spin, c.play("onGoing")
            }, i.timeout.spin), l.log(u.ankey, "Spin", u.prize.key)
        }
    };
    var d = function() {
        for (var n; !n;) {
            var t = u.structured[u.prize.skey].length;
            t || (u.prize.skey = "nan", t = u.structured[u.prize.skey].length), u.structured[u.prize.skey] = _.shuffle(u.structured[u.prize.skey]);
            var e = new Date,
                a = e.getSeconds(),
                o = _.random(0, t * a) % t,
                s = u.structured[u.prize.skey][o];
            u.iAIDs = o, u.id = u.ids[s], u.selectedIds.indexOf(u.id) >= 0 ? u.structured[u.prize.skey].splice(o, 1) : n = !0
        }
        u.name = u.names && u.names[s] ? u.names[s] : "", u.namex = u.name.replace("|", "<br/>"), u.selectedIds.push(u.id), i.specialPrizes.indexOf(u.prize.key) == -1 ? u.remainStops = 1 : u.remainStops = 2
    };
    u.stopBatch = function(n) {
        if (u.state === i.states.spin) {
            u.state = i.states.stop, c.play("stop"), u.ux.mLeave("stop");
            var a;
            a = 250 * n > 3e4 ? Math.round(3e4 / n) : 1e4 / n > 2e3 ? 2e3 : 250;
            for (var o = 0; o < n; o++) t(function() {
                var n = u.structured[u.prize.skey].length;
                if (n) {
                    var t = new Date,
                        e = t.getSeconds(),
                        a = _.random(0, n * e) % n,
                        i = u.structured[u.prize.skey][a],
                        o = a,
                        s = u.ids[i],
                        r = u.names && u.names[i] ? u.names[i] : "";
                    u.selectedIds.push(s), u.prizes[u.prizeIndex].confirmed++, u.animClass.prizecount = "prize-increase", c.play("prizeIncreased");
                    var l = {
                        name: r || null,
                        id: s,
                        time: "",
                        status: "Confirmed"
                    };
                    "presentation" === u.appState.name ? (l.time = firebase.database.ServerValue.TIMESTAMP, u.results.$ref().child(u.prize.key).push(l)) : (l.time = Date.now(), u.results[u.prize.key].push(l)), u.totalResults++, u.structured[u.prize.skey].splice(o, 1)
                }
            }, o * a + 500);
            var s = 600;
            s += a >= 1e3 ? (n - 1) * a : n * a, t(function() {
                angular.forEach(u.machines, function(n, t) {
                    n.stop(), c.stop("spinHigh" + t, u.machinesDelay[t] + 800), t === u.longestIdLen - 1 && c.stop("spinHigh", u.machinesDelay[t])
                }), u.animClass.message = null, u.animClass.prizecount = null, u.lightOff = !1, u.state = i.states.ready, e.open("IdResult"), l.log(u.ankey, "Batch Confirm", u.prize.key)
            }, s)
        }
    }, u.stop = function() {
        if (u.state === i.states.spin) {
            u.state = i.states.stop, c.play("stop"), u.ux.mLeave("stop"), u.id || d(), u.remainStops--;
            var n = _.padStart(u.id, u.longestIdLen);
            if (angular.forEach(u.machines, function(t, e) {
                    e < u.longestIdLen - u.remainStops && t.running && (t.setRandomize(function() {
                        return u.characters[e].indexOf(n[e])
                    }), t.stop(), c.stop("spinHigh" + e, u.machinesDelay[e] + 800), e === u.longestIdLen - 1 && c.stop("spinHigh", u.machinesDelay[e]))
                }), u.remainStops > 0) t(function() {
                u.state = i.states.spin, c.play("onGoing")
            }, i.timeout.spin + 900);
            else {
                var e = i.specialPrizes.indexOf(u.prize.key) == -1 ? "" : "High";
                if (u.name) {
                    t(function() {
                        u.state = i.states.reveal, c.play("comingWinner" + e, 0, "loop")
                    }, i.timeout.revealLoading);
                    var a = i.timeout["revealName" + e]
                } else var a = i.timeout.revealId;
                t(function() {
                    u.animClass.message = "winner-reveal", u.state = i.states.complete, c.stop("comingWinner" + e), c.play("tada" + e), c.play("actionButtons", 1500)
                }, a)
            }
            l.log(u.ankey, "Stop", u.prize.key)
        }
    }, u.save = function() {
        u.state === i.states.complete && (u.ux.mLeave("confirm"), u.state = i.states.toconfirm, i.specialPrizes.indexOf(u.prize.key) >= 0 ? c.play("confirmSpecial") : c.play("confirm"), u.animClass.message = "winner-confirm", t(function() {
            u.prizes[u.prizeIndex].confirmed++, u.state = i.states.confirmed, u.animClass.prizecount = "prize-increase", c.play("prizeIncreased")
        }, i.timeout.confirmed), g("Confirmed"), t(function() {
            u.state = i.states["null"], u.animClass.message = null, u.animClass.prizecount = null, c.play("turnoffSlots", 350), t(function() {
                u.lightOff = !1, u.state = i.states.ready, c.play("turnonSlots", 150), c.play("actionButtons", 1100), c.play("background", 2e3, "loop")
            }, 1e3)
        }, 1500), l.log(u.ankey, "Confirm", u.prize.key))
    }, u.retry = function() {
        u.state === i.states.complete && (u.ux.mLeave("confirm"), u.state = i.states.cancel, c.play("retry"), u.animClass.message = "winner-cancel", t(function() {
            u.state = i.states["null"], u.animClass.message = null, u.animClass.prizecount = null, c.play("turnoffSlots", 350), t(function() {
                u.lightOff = !1, u.state = i.states.ready, c.play("turnonSlots", 150), c.play("actionButtons", 1100), c.play("background", 2e3, "loop")
            }, 1e3)
        }, 500), l.log(u.ankey, "Reject", u.prize.key))
    };
    var g = function(n) {
            var t = {
                name: u.name || null,
                id: u.id,
                time: "",
                status: n
            };
            "presentation" === u.appState.name ? (t.time = firebase.database.ServerValue.TIMESTAMP, u.results.$ref().child(u.prize.key).push(t)) : (t.time = Date.now(), u.results[u.prize.key].push(t)), "Confirmed" === n && u.totalResults++, u.structured[u.prize.skey].splice(u.iAIDs, 1)
        },
        m = function() {
            return !!u.isLimited({
                r: u.totalResults
            }) && (c.play("na"), l.log("milestone", "Over Free Results", u.totalResults, {
                prize: u.prize.key
            }), e.open("Payment", !0, !0), !0)
        };
    u.$onDestroy = function() {
        u.destroyMachines(), c.stop("background")
    }
}

function HotKeysController(n, t, e, a, i) {
    var o = this;
    o.$onInit = function() {
        n.add({
            combo: "enter",
            callback: function() {
                a.log("ui_action", "Hotkey", "Enter"), o.enter()
            }
        }), n.add({
            combo: "f10",
            callback: function() {
                a.log("ui_action", "Hotkey", "Next Step"), o.nextstep()
            }
        }), n.add({
            combo: "left",
            callback: function() {
                a.log("ui_action", "Hotkey", "Prev - Left"), o.prev()
            }
        }), n.add({
            combo: "4",
            callback: function() {
                a.log("ui_action", "Hotkey", "Prev - 4"), o.prev()
            }
        }), n.add({
            combo: "right",
            callback: function() {
                a.log("ui_action", "Hotkey", "Next - Right"), o.next()
            }
        }), n.add({
            combo: "6",
            callback: function() {
                a.log("ui_action", "Hotkey", "Next - 6"), o.next()
            }
        }), n.add({
            combo: "+",
            callback: function() {
                a.log("ui_action", "Hotkey", "Confirm - Plus"), o.confirm()
            }
        }), n.add({
            combo: "-",
            callback: function() {
                a.log("ui_action", "Hotkey", "Cancel - Minus"), o.cancel()
            }
        }), n.add({
            combo: "r",
            callback: function() {
                a.log("ui_action", "Hotkey", "R"), t.open("IdResult")
            }
        }), n.add({
            combo: "m",
            callback: function() {
                a.log("ui_action", "Hotkey", "M"), i.controller.toggle()
            }
        })
    }
}

function FooterController(n, t, e, a, i, o, s) {
    var r = this;
    r.$onInit = function() {
        r.appState = n.current, r.user = t, r.modals = e, r.navigate = a, r.ux = i, r.analytics = o, r.audio = s
    }
}

function offlineDirective() {
    return {
        restrict: "A",
        link: function(n, t, e) {
            function a(n) {
                return n.preventDefault(), !1
            }
            var i = firebase.database().ref(".info/connected");
            i.on("value", function(n) {
                n.val() === !0 ? t.off("click", a) : t.on("click", a)
            })
        }
    }
}

function appbackgroundDirective(n) {
    return {
        restrict: "A",
        link: function(t, e, a) {
            e.bind("load", function() {
                n.url_background = "url(" + a.src + ")"
            })
        }
    }
}

function PresentationController(n, t, e, a, i, o, s, r) {
    var l = this;
    l.$onInit = function() {
        $("#loader").show(), r.log("visit_pres", "Init"), l.lockUI = !0, t(function() {
            l.lockUI && (r.log("error", "Init Presentation", "Timeout"), a("presentation", "reload"))
        }, 6e3), l.user = i, l.user.load().then(function(t) {
            l.lockUI = !1, l.data = l.user.member.data, l.setting = l.user.member.setting, l.results = o, a("presentation", {
                sessionId: l.results.$id,
                notify: !1
            }), s.setLang(), n.theme = l.user.getRuntimeOpt("theme", null), n.background = l.setting.info.background || e.info.background, setTimeout(function() {
                $("#loader").fadeOut()
            }, 500), r.log("visit_pres", "Loaded")
        })
    }, l.isLimited = function(n) {
        return "limited" === i.status("presentation", n)
    }
}

function ModController(n, t, e, a, i, o, s, r, l, c, u, d, g, m) {
    var p = this;
    p.$onInit = function() {
        $("#loader").show(), g.log("visit_mod", "Init"), p.lockUI = !0, e(function() {
            p.lockUI && (g.log("error", "Init Customize", "Timeout"), l("customize", "reload"))
        }, 6e3), p.user = s, p.user.load().then(function(e) {
            p.lockUI = !1, p.lightOff = !1, p.data = p.user.member.data, p.setting = p.user.member.setting, p.ux = d, p.modals = r, p.navigate = l, p.devOps = i, p.appState = t.current, p.defaultSetting = o, p.prizes = c.load(p.setting, !0), p.animClass = {}, p.longestIdLen = 3, p.data.ids && p.data.ids.length ? p.setting.runtime && p.setting.runtime.longestIdLen ? p.setting.runtime.longestIdLen > p.longestIdLen && (p.longestIdLen = p.setting.runtime.longestIdLen) : angular.forEach(p.data.ids, function(n, t) {
                n = String(n).replace(/\s+/g, ""), n.length > p.longestIdLen && (p.longestIdLen = n.length)
            }) : p.longestIdLen = 6, p.machineSlots = _.range(0, p.longestIdLen), p.slotsCss = i.slotsCss(p.longestIdLen), p.clpkopbr = p.devOps.colorPickerOp("bottom right"), p.clpkoptl = p.devOps.colorPickerOp("top left"), p.changed = {
                infoname: !1,
                infocompany: !1
            }, p.colorEvents = {
                onClose: function(n, t, e) {
                    p.user.save("setting", "colorPicker"), g.log("customize", "Custom Color Picked", t)
                }
            }, p.characters = [], p.machines = [], p.state = i.states.ready, p.setPrize(0), p.ux.setcssIntro(s.member.setting), u.setLang(), n.theme = p.user.getRuntimeOpt("theme", null), n.background = p.setting.info.background || o.info.background, m.init(p.longestIdLen), setTimeout(function() {
                $("#loader").fadeOut(), p.modals.doLoginOpen() || p.data.ids && p.data.ids.length || p.modals.open("Id")
            }, 500), g.log("visit_mod", "Loaded")
        })
    }, p.setPrize = function(n) {
        p.state !== i.states.ready || n < 0 || n >= p.prizes.length || (p.state = i.states.setprize, n < p.prizeIndex ? p.animClass.setprize = "prize-prev" : p.prizeIndex >= 0 && (p.animClass.setprize = "prize-next"), p.prizeIndex = n, p.prize = p.prizes[n], e(function() {
            p.animClass.setprize = null, p.state = i.states.ready
        }, i.timeout.ready), p.animClass.setprize && g.log("customize", "Prize Switched", p.prize.key))
    }, p.setPrevPrize = function() {
        p.setPrize(p.prizeIndex - 1)
    }, p.setNextPrize = function() {
        p.setPrize(p.prizeIndex + 1)
    }, p.uploadLogo = function(n) {
        p.user.editing.infologo || (p.user.upload(n, "", "info", "logo"), g.log("customize", "Logo Upload"))
    }, p.removeLogo = function() {
        p.setting.info.logo = "", p.user.editing.infologo = !0, e(function() {
            p.user.save("setting", "infologo"), g.log("customize", "Logo Removed")
        }, 1e3)
    }, p.saveSetting = function(n) {
        p.changed[n] ? (p.user.save("setting", n), p.changed[n] = !1, g.log("customize", n + " changed")) : (p.user.editing[n] = !1, g.log("ui_action", "Edit Without Changes", n))
    }, p.goPresentation = function() {
        p.ux.mLeave("pres"), p.data.ids && p.data.ids.length ? (g.log("ui_action", "Go Presentation", "From Customize"), p.navigate("presentation")) : (g.log("ui_action", "Fail to Go Presentation", "Ids Empty"), p.modals.open("Id"))
    }
}

function MainController(n, t, e, a, i, o, s, r, l, c, u, d, g) {
    function m() {
        var n = e.search() || {};
        n.referrer = document.referrer, window.$luckydraw = window.$luckydraw || {}, window.$luckydraw.paymentReturn = n;
        var s = n.referrer && n.amount ? "soha" : "";
        s ? t.post(i.provider[s].ipn, n).then(function(n) {
            n.data.ok ? window.location.href = "/customize" : $("#loader").fadeOut()
        })["catch"](function(t) {
            $("#loader").fadeOut(), o.alert("", a.instant("Please contact LuckyDraw to manually activate your payment")), g.log("error", "Process Payment", n)
        }) : setTimeout(function() {
            $("#loader").fadeOut()
        }, 500)
    }
    var p = this;
    p.$onInit = function() {
        p.data = r(), p.setting = l, p.results = c, u.setLang(), n.theme = d.getRuntimeOpt("theme", null), n.background = s.info.background, g.log("visit_home"), m()
    }, p.isLimited = function(n) {
        return !1
    }
}

function routesConfig(n, t, e, a) {
    e.html5Mode(!0).hashPrefix("!"), t.when(/presentation$/, "/presentation/").when(/customize\/$/, "/customize").when(/v[0-9]+\/(.*)/, "/$1").otherwise("/"), n.state("app", {
        url: "/",
        templateUrl: "templates/main.html",
        controller: "MainController",
        controllerAs: "$ctrl",
        resolve: {}
    }).state("customize", {
        url: "/customize",
        templateUrl: "templates/mod.html",
        controller: "ModController",
        controllerAs: "$ctrl",
        resolve: {
            auth: ["authService", function(n) {
                return n.$requireSignIn()
            }]
        }
    }).state("presentation", {
        url: "/presentation/:sessionId",
        templateUrl: "templates/presentation.html",
        controller: "PresentationController",
        controllerAs: "$ctrl",
        resolve: {
            auth: ["authService", function(n) {
                return n.$requireSignIn()
            }],
            results: ["auth", "resultService", "$stateParams", function(n, t, e) {
                var a = e.sessionId;
                return t.load("presentation", a)
            }]
        }
    }), a.state("login", {
        parent: "app",
        url: "login",
        component: "modalLogin",
        size: "login-register"
    }).state("register", {
        parent: "app",
        url: "register",
        component: "modalRegister",
        size: "login-register"
    }).state("forgotPassword", {
        parent: "app",
        url: "forgot-password",
        component: "modalForgotPassword",
        size: "login-register"
    })
}
routesConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider", "$modalStateProvider"], notificationController.$inject = ["$uibModal", "$firebaseObject", "authService", "firebaseRef", "Analytics"], ThemeController.$inject = ["$rootScope", "devOps", "userdataService"], SurveyController.$inject = ["$state", "Analytics"], RegisterController.$inject = ["$state", "$http", "authService", "devOps", "i18nService", "Analytics"], PrizeController.$inject = ["userdataService", "defaultSettingService", "prizeService", "navService", "uxService", "Analytics"], PaymentController.$inject = ["$interval", "$state", "modalService", "userdataService", "i18nService", "paymentService", "devOps", "$compile", "$scope"], PaymentIntroController.$inject = ["$state", "userdataService"], PaymentButtonController.$inject = ["userdataService"], PaypalPaymentController.$inject = ["$sce", "$state", "$http", "authService", "Analytics", "userService", "userdataService", "paymentService", "modalService"], SohaPaymentController.$inject = ["$state", "$http", "authService", "Analytics", "userService", "userdataService", "paymentService", "modalService"], MessageController.$inject = ["userdataService", "Analytics"], LoginController.$inject = ["$state", "authService", "Analytics"], LanguageController.$inject = ["i18nService", "Analytics"], IntroController.$inject = ["modalService"], IdsResultController.$inject = ["$state", "$timeout", "$stateParams", "resultService", "prizeService", "userdataService", "defaultSettingService", "$translate", "userService", "Analytics"], IdController.$inject = ["$state", "navService", "userdataService", "devOps", "Analytics"], ForgotPasswordController.$inject = ["authService", "modalService", "Analytics"], ContactController.$inject = ["$http", "modalService", "devOps", "Analytics"], ButtonController.$inject = ["userdataService", "Analytics"], BackgroundController.$inject = ["$rootScope", "$timeout", "$interval", "userService", "userdataService", "modalService", "Analytics"], AlertController.$inject = ["userService", "$interval"], AccountController.$inject = ["$scope", "modalService", "authService", "userdataService", "devOps", "uxService", "Analytics"], IdLuckyDrawController.$inject = ["$state", "$timeout", "modalService", "defaultSettingService", "devOps", "prizeService", "userService", "uxService", "Analytics", "audioService"], HotKeysController.$inject = ["hotkeys", "modalService", "navService", "Analytics", "audioService"], FooterController.$inject = ["$state", "userService", "modalService", "navService", "uxService", "Analytics", "audioService"], appbackgroundDirective.$inject = ["$rootScope"], PresentationController.$inject = ["$rootScope", "$timeout", "defaultSettingService", "navService", "userdataService", "results", "i18nService", "Analytics"],
    ModController.$inject = ["$rootScope", "$state", "$timeout", "Fullscreen", "devOps", "defaultSettingService", "userdataService", "modalService", "navService", "prizeService", "i18nService", "uxService", "Analytics", "audioService"], MainController.$inject = ["$rootScope", "$http", "$location", "$translate", "paymentService", "modalService", "defaultSettingService", "defaultIdService", "initSettingService", "defaultResultService", "i18nService", "userdataService", "Analytics"], angular.module("app", ["ui.router", "ui.bootstrap", "firebase", "pascalprecht.translate", "angularMoment", "FBAngular", "ngSanitize", "ngCookies", "ngAnimate", "ngFileUpload", "ngSanitize", "ngCsv", "cfp.hotkeys", "angular.filter", "color.picker"]).config(["$qProvider", "$translateProvider", function(n, t) {
        var e = {
            apiKey: "AIzaSyATfmr6y4QBfiTaeWo-K8Bkb9lNpdMzJYU",
            authDomain: "luckydraw-fd117.firebaseapp.com",
            databaseURL: "https://luckydraw-fd117.firebaseio.com",
            storageBucket: "luckydraw-fd117.appspot.com",
            messagingSenderId: "537953130117"
        };
        firebase.initializeApp(e), n.errorOnUnhandledRejections(!1), t.translations("en", i18n_en), t.translations("vi", i18n_vi), t.preferredLanguage("en"), t.useLocalStorage()
    }]).run(["$rootScope", "$state", "Fullscreen", function(n, t, e) {
        n.$on("$stateChangeError", function(n, e, a, i, o, s) {
            "AUTH_REQUIRED" === s && (n.preventDefault(), t.go("login"))
        }), n.$on("$stateChangeStart", function(n, t, e, a, i, o) {}), e.$on("FBFullscreen.change", function(n, t) {})
    }]),
    function() {
        "serviceWorker" in navigator && navigator.serviceWorker.register("service-worker.js").then(function(n) {
            n.onupdatefound = function() {
                var t = n.installing;
                t.onstatechange = function() {
                    switch (t.state) {
                        case "installed":
                            navigator.serviceWorker.controller ? console.log("New or updated content is available.") : console.log("Content is now available offline!");
                            break;
                        case "redundant":
                            console.error("The installing service worker became redundant.")
                    }
                }
            }
        })["catch"](function(n) {
            console.error("Error during service worker registration:", n)
        })
    }(),
    function(n, t, e, a) {
        function i() {
            var n = e.getElementById("viewportMeta");
            screen.width < 768 ? n.setAttribute("content", "width=device-width, user-scalable=no") : n.setAttribute("content", "width=1280, initial-scale=1.0")
        }
        n(t), n(e);
        i(), t.addEventListener("resize", i, !1)
    }(jQuery, window, document), angular.module("app").factory("uxService", ["$firebaseObject", "$timeout", "firebaseRef", "initSettingService", "authService", "devOps", "modalService", "$q", "Analytics", function(n, t, e, a, i, o, s, r, l) {
        var c = {
                prevnext: !1,
                spin: !1,
                stop: !1,
                confirm: !1,
                IdResult: !1,
                pres: !1
            },
            u = {
                infologo: "",
                infoname: "",
                colorsname: "",
                infocompany: "",
                prizes: "",
                dataids: "",
                messages: "",
                colorsaction_msg: "",
                buttons: ""
            },
            d = function(n) {
                c[n] = !0
            },
            g = function(n) {
                c[n] = !1
            },
            m = function(n) {
                setTimeout(function() {
                    $(n).focus()
                }, 200)
            },
            p = function(n) {
                var e = "";
                angular.copy({}, u), void 0 === n.runtime.longestIdLen ? e = "dataids" : void 0 === n.info.background ? e = "infobackground" : void 0 === n.runtime.theme ? e = "runtimetheme" : Object.keys(n.icons).length <= 1 && (e = "prizes"), e && t(function() {
                    u[e] = "look-at-me"
                })
            },
            h = function(n, t) {
                if (!n) return {};
                var e = {
                    color: n,
                    "text-shadow": t ? f(n) + " 1px 1px 1px" : ""
                };
                return e
            },
            f = function(n) {
                var t = parseInt(n.substr(1, 2), 16),
                    e = parseInt(n.substr(3, 2), 16),
                    a = parseInt(n.substr(5, 2), 16),
                    i = (299 * t + 587 * e + 114 * a) / 1e3;
                return i >= 128 ? "black" : "white"
            };
        return {
            hint: c,
            mOver: d,
            mLeave: g,
            focus: m,
            cssIntro: u,
            setcssIntro: p,
            style: h
        }
    }]), angular.module("app").factory("userdataService", ["$firebaseObject", "firebaseRef", "initSettingService", "authService", "devOps", "modalService", "uxService", "$q", "Analytics", function(n, t, e, a, i, o, s, r, l) {
        var c = {
                guest: {},
                member: {}
            },
            u = {},
            d = a,
            g = function() {
                c.member.setting = n(t().child("setting")), c.member.membership = n(t().child("member")), c.member.data = n(t().child("idDraw"))
            },
            m = function() {
                c.guest.setting = {}, c.guest.membership = {}, c.guest.data = {
                    ids: [],
                    names: []
                }, angular.copy(e, c.guest.setting)
            },
            p = function() {
                for (var n in e) void 0 === c.member.setting[n] && (c.member.setting[n] = e[n])
            },
            h = function() {
                return r(function(n, t) {
                    void 0 === c.member.data && g();
                    var e = Object.keys(c.member),
                        a = "",
                        i = -1;
                    for (var o in c.member) "setting" == o && (a = "setting"), c.member[o].$loaded().then(function() {
                        i++, "setting" == a && p(), i == e.length - 1 && n(i)
                    })
                })
            };
        m(), d.$getAuth() && (g(), h()), d.$onAuthStateChanged(function(n) {
            n && void 0 === c.member.data && (g(), h())
        });
        var f = function(n, t) {
                return r(function(e, a) {
                    return c.member[n] ? void c.member[n].$save().then(function() {
                        t && (u[t] = !1), s.setcssIntro(c.member.setting), e(!0)
                    })["catch"](function(e) {
                        l.log("error", "Saving " + n + "/" + t, e), a(!1)
                    }) : void a(void 0)
                })
            },
            y = function(n, t) {
                if (c.member.setting) return !!c.member.setting[n] && (u[n + t] = !0, c.member.setting[n][t] = null, f("setting", n + t), !0)
            },
            v = function(n, t, e, a) {
                return r(function(i, r) {
                    if (!o.isOnLine("alert", "data") || !o.isAuthenticated("login", t)) return void r(!1);
                    if (u[e + a]) return void r("already uploading this item");
                    if (!c.member.setting) return void r(void 0);
                    u[e + a] = !0;
                    var g = firebase.storage().ref().child(e + "/" + a).child(d.$getAuth().uid),
                        m = g.put(n, {});
                    m.on("state_changed", function(n) {
                        var t = n.bytesTransferred / n.totalBytes * 100;
                        console.debug("Upload is " + t + "% done")
                    }, function(n) {
                        u[e + a] = !1, l.log("error", "Uploading " + e + "/" + a, n), r("upload failed")
                    }, function() {
                        var n = m.snapshot.metadata,
                            t = n.downloadURLs[0];
                        c.member.setting[e] || (c.member.setting[e] = {}), c.member.setting[e][a] = t, c.member.setting.$save().then(function() {
                            u[e + a] = !1, s.setcssIntro(c.member.setting), i(t)
                        })["catch"](function(n) {
                            u[e + a] = !1, l.log("error", "Saving setting/" + child + "/" + a, n), r("save failed")
                        })
                    })
                })
            },
            b = function(n, t) {
                var e = localStorage.getItem("setting.runtime." + n) || t || i.runtime[n];
                return c.member.setting && c.member.setting.runtime ? c.member.setting.runtime[n] || e : e
            },
            w = function(n, t) {
                localStorage.setItem("setting.runtime." + n, t), c.member.setting && c.member.setting.runtime && (c.member.setting.runtime[n] = t, f("setting", n))
            },
            $ = function(n, t) {
                var e = Date.now();
                if (c.member.membership && c.member.membership.lastPayment) var a = e < c.member.membership.expiration ? "Paid Account" : "Expired Account";
                else var a = "Free Account";
                return "presentation" === n && t >= i.freeSaves && "Paid Account" !== a ? "limited" : a
            };
        return {
            guest: c.guest,
            member: c.member,
            status: $,
            load: h,
            save: f,
            editing: u,
            upload: v,
            remove: y,
            getRuntimeOpt: b,
            setRuntimeOpt: w
        }
    }]).factory("userService", ["authService", "firebaseRef", "devOps", "Analytics", "$uibModal", "$window", "$rootScope", function(n, t, e, a, i, o, s) {
        function r() {
            var n = function() {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
            };
            return n() + n() + "-" + n() + "-" + n() + "-" + n() + "-" + n() + n() + n()
        }
        var l = {
                authenticated: !1,
                email: "",
                uid: ""
            },
            c = {},
            u = n;
        l.logout = function() {
            $("#loader").show(), c.multipleLogin || c.ref.set({
                signature: null
            }), setTimeout(function() {
                u.$signOut().then(function() {
                    o.location.href = o.location.origin
                })
            }, 500)
        }, l.checkin = function() {
            c.signature || (c.signature = localStorage.getItem("client.signature") || r(), localStorage.setItem("client.signature", c.signature)), l.authenticated && !c.multipleLogin && (c.ref || (c.ref = t().child("client")), c.ref.once("value").then(function(n) {
                var t = n.val();
                if (!t || !t.signature || t.signature === c.signature || Date.now() - t.moment > e.loginTimeout) c.multipleLogin = !1, c.ref.set({
                    signature: c.signature,
                    moment: Date.now()
                }), c.setonDisconnect || (c.setonDisconnect = !0, c.ref.onDisconnect().set({
                    signature: null
                }));
                else {
                    c.multipleLogin = !0, a.log("misused", "Multiple Devices Login");
                    var o = {
                        component: "modalAlert",
                        size: "account-info",
                        backdrop: "static",
                        keyboard: !1,
                        animation: !1,
                        windowClass: "animation-modal-x",
                        resolve: {
                            title: function() {
                                return "Account is being used"
                            },
                            message: function() {
                                return "Someone logged-in somewhere!"
                            },
                            dismissLogout: function() {
                                return !0
                            }
                        }
                    };
                    i.open(o), setTimeout(function() {
                        l.logout()
                    }, 11e3)
                }
            }))
        };
        var d = u.$getAuth();
        return d && (l.authenticated = !0, l.email = d.email, l.uid = d.uid, l.checkin()), u.$onAuthStateChanged(function(n) {
            s.$apply(function() {
                n ? (d = u.$getAuth(), l.authenticated = !0, l.email = d.email, l.uid = d.uid, l.checkin()) : l.authenticated = !1
            })
        }), l
    }]), angular.module("app").factory("devOps", function() {
        var n = {};
        return n.version = "1.5015", n.domain = "www.quayso.xemayvinhtruong.vn", n.sitename = "XEMAYVINHTRUONG.VN", n.runtime = {
            theme: "purple",
            language: "en",
            audioMode: 0
        }, n.max_prizes = 23, n.specialPrizes = ["gold", "diamond", "x"], n.defaultPrizes = ["bronze", "silver", "gold", "diamond", "x"], n.maxLengthId = 23, n.spinDirection = "down", n.favNum = "9", n.freeSpins = 2, n.freeSaves = 1, n.cssSlotRanges = [6, 9, 11, 16], n.loginTimeout = 36e5, n.slotsCss = function(t) {
            for (var e = n.cssSlotRanges, a = 0; a < e.length; a++)
                if (t <= e[a]) return e[a];
            return e[a - 1]
        }, n.states = {
            setprize: "setprize",
            ready: "ready",
            tospin: "tospin",
            spin: "spin",
            stop: "stop",
            reveal: "reveal",
            complete: "complete",
            toconfirm: "toconfirm",
            confirmed: "confirmed",
            cancel: "cancel",
            "null": "null"
        }, n.mdelay = {
            min: 600,
            max: 1100
        }, n.timeout = {
            ready: 1e3,
            spin: 1e3,
            revealLoading: 1800,
            revealName: 3300,
            revealNameHigh: 4500,
            revealId: 1e3,
            confirmed: 800
        }, n.checkChars = [{
            chars: "0123456789",
            regexp: "[0-9]"
        }, {
            chars: "bdfhnprtyz",
            regexp: "[a-z]"
        }, {
            chars: "ABFGHKNSVX",
            regexp: "[A-Z]"
        }, {
            chars: "~@#$%&*+-=",
            regexp: "\\W"
        }], n.colorPickerOp = function(n) {
            return {
                pos: n || "bottom right",
                format: "hex",
                alpha: !1,
                swatchOnly: !0,
                close: {
                    show: !0,
                    label: "Ok",
                    "class": ""
                },
                clear: {
                    show: !0,
                    label: "Reset",
                    "class": ""
                }
            }
        }, n.themes = {
            purple: "Theme Purple",
            navy: "Theme Navy",
            olive: "Theme Olive",
            orange: "Theme Orange",
            black: "Theme Black",
            blue: "Theme Blue",
            green: "Theme Green",
            red: "Theme Red",
            silver: "Theme Silver",
            aqua: "Theme Aqua",
            yellow: "Theme Yellow",
            white: "Theme White"
        }, n.api = {
            contact: "https://nqm8b544zg.execute-api.us-east-1.amazonaws.com/v1/contact",
            welcome: "https://vzk6bx8b8b.execute-api.us-east-1.amazonaws.com/v1",
            ipinfo: "https://ipinfo.io/?token=991b2bb97a554e"
        }, n.audioIcons = ["ion-ios-musical-notes", "ion-ios-musical-note", "ion-volume-mute"], n
    }).factory("settingService", ["$firebaseObject", "initSettingService", "firebaseRef", function(n, t, e) {
        var a = t;
        n.$extend({
            $$defaults: a
        });
        return new n(e().child("setting"))
    }]).factory("initSettingService", function() {
        return {
            audio: {
                spin: {
                    i: 1
                }
            },
            info: {
                i: 1
            },
            icons: {
                i: 1
            },
            colors: {
                i: 1
            },
            prizes: {
                i: 1
            },
            enabled_prizes: {
                i: 1
            },
            messages: {
                i: 1
            },
            buttons: {
                i: 1
            },
            runtime: {
                i: 1
            }
        }
    }).factory("defaultSettingService", ["devOps", function(n) {
        for (var t, e = {
                owner: "guest",
                audio: {
                    background: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/background.mp3",
                    spin: {
                        High: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/sm-roller-loop.mp3"
                    },
                    setPrize: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/swoosh.mp3",
                    turnoffSlots: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/sm-turnoff.mp3",
                    turnonSlots: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/sm-turnon.mp3",
                    start: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/sm-spin.mp3",
                    stop: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/sm-bet.mp3",
                    onGoing: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-bonus.mp3",
                    comingWinner: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-countdown.mp3",
                    comingWinnerHigh: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-sm-jackpot-coming.mp3",
                    tada: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-tada.mp3",
                    tadaHigh: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-sm-jackpot-win.mp3",
                    confirm: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/fanfare-winner.mp3",
                    confirmSpecial: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/fanfare-brass.mp3",
                    prizeIncreased: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-levelup-s3.mp3",
                    retry: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-over.mp3",
                    na: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-click-s2.mp3",
                    actionButtons: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/game-correct-s2.mp3",
                    batchStart: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/audio/v1/sm-autoplay.mp3"
                },
                info: {
                    background: "",
                    logo: "",
                    name: "Amazing Event",
                    company: ""
                },
                icons: {
                    "default": "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/custom-prize.svg",
                    x: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/x-prize.svg",
                    diamond: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/diamond-prize.svg",
                    gold: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/gold-prize.svg",
                    silver: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/silver-prize.svg",
                    bronze: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/bronze-prize.svg"
                },
                iconsWithoutBackground: {
                    "default": "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/custom-icon.svg",
                    x: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/x-icon.svg",
                    diamond: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/diamond-icon.svg",
                    gold: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/gold-icon.svg",
                    silver: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/silver-icon.svg",
                    bronze: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/temp/bronze-icon.svg"
                },
                colors: {
                    name: "",
                    action_msg: ""
                },
                prizes: {
                    x: "X Prize",
                    diamond: "Diamond Prize",
                    gold: "Gold Prize",
                    silver: "Silver Prize",
                    bronze: "Bronze Prize"
                },
                enabled_prizes: {
                    x: !0,
                    diamond: !0,
                    gold: !0,
                    silver: !0,
                    bronze: !0
                },
                messages: {
                    start: "Press the Spin button to start",
                    wait: "Winner is coming..."
                },
                buttons: {
                    spin: "Spin",
                    stop: "Stop",
                    confirm: "Confirm",
                    retry: "Retry"
                },
                runtime: {}
            }, a = 4; a <= n.max_prizes; a++) t = "p" + a, e.prizes[t] = "Prize " + a, e.enabled_prizes[t] = !1;
        return e
    }]), angular.module("app").factory("defaultResultService", ["devOps", function(n) {
        for (var t = {}, e = n.defaultPrizes.length - 1; e >= 0; e--) t[n.defaultPrizes[e]] = [];
        return t
    }]).factory("resultService", ["$firebaseObject", "$firebaseArray", "firebaseRef", "defaultResultService", function(n, t, e, a) {
        var i = {},
            o = {},
            s = function(s, r, l) {
                switch (s) {
                    case "presentation":
                        return i.presentation || (r ? i.presentation = e().child("idDrawResults").child(r) : i.presentation = e().child("idDrawResults").push(), o.presentation = n(i.presentation)), "array" === l ? [o.presentation] : o.presentation;
                    case "customize":
                        return i.customize || (i.customize = e().child("idDrawResults"), o.customize = t(i.customize.orderByKey())), o.customize;
                    default:
                        return [a]
                }
            },
            r = function(n, t) {
                i.customize.child(n).set({})
            };
        return {
            load: s,
            clear: r
        }
    }]).factory("prizeService", ["defaultSettingService", "devOps", function(n, t) {
        var e = {
                guest: [],
                user: [],
                "default": []
            },
            a = function(a, i) {
                var o = 9999 === i;
                if (o) var s = "default";
                else var s = "guest" === a.owner ? "guest" : "user";
                if (e[s].length > 0 && !i) return e[s];
                e[s] = [];
                for (var r, l, c, u, d, g = Object.keys(n.prizes), m = t.defaultPrizes.length - 1, p = 0; p < g.length; p++)
                    if (r = g[p], u = d = !1, p <= m ? (u = a.enabled_prizes[r] !== !1, o && u && (a.enabled_prizes[r] = !0)) : d = a.enabled_prizes[r] === !0, o || u || d) {
                        if (c = !0, !o && a.icons && a.icons[r]) l = a.icons[r];
                        else {
                            var h = o ? "iconsWithoutBackground" : "icons";
                            l = n[h][r] || n[h]["default"], c = p <= m
                        }
                        e[s].unshift({
                            key: r,
                            name: n.prizes[r],
                            image: l,
                            showimage: c,
                            confirmed: 0
                        })
                    } return e[s]
            },
            i = function(n) {
                for (var e = 0; e < t.defaultPrizes.length; e++) n[t.defaultPrizes[e]] = !0
            };
        return {
            load: a,
            enable_default: i,
            currentTab: 0
        }
    }]), angular.module("app").factory("paymentService", ["$translate", "$window", function(n, t) {
        var e = {
                paypal: {
                    url: "https://www.paypal.com/cgi-bin/webscr",
                    prices: {
                        event1day: 80,
                        event3days: 150,
                        event5days: 200
                    },
                    buttons: {
                        event1day: "69PXXC753L4R6",
                        event3days: "L3LX5AGBBVMTS",
                        event5days: "VTGTC3KMK7ECC"
                    }
                },
                soha: {
                    url: "https://b2m6exn2df.execute-api.ap-southeast-1.amazonaws.com/prod/initSoha",
                    ipn: "https://b2m6exn2df.execute-api.ap-southeast-1.amazonaws.com/prod/ipnSoha",
                    prices: {
                        event1day: 19e5,
                        event3days: 35e5,
                        event5days: 46e5
                    },
                    ps: "1Pay"
                }
            },
            a = {
                en: "paypal",
                vi: "paypal"
            },
            i = function(n) {
                n ? $('<div class="paypal-loading"></div>').appendTo("body") : $("div.paypal-loading").remove()
            },
            o = {
                event1day: 30,
                event3days: 6,
                event5days: 9
            };
        return {
            provider: e,
            local: a,
            loadingIcon: i,
            times: o
        }
    }]), angular.module("app").factory("navService", ["$state", "$stateParams", "$window", "Fullscreen", "modalService", "Analytics", function(n, t, e, a, i, o) {
        var s;
        return s = function(s, r) {
            if ("reload" === r) return void n.go(s, {}, {
                reload: !0
            });
            if ("reload.browser" === r) return n.current.name !== s && n.go(s), void setTimeout(function() {
                e.location.reload(!0)
            }, 1e3);
            var l = n.current.name + ">" + s;
            switch (l) {
                case "presentation>customize":
                    navigator.onLine ? (o.log("ui_action", "Presentation Finished"), n.go("customize"), a.cancel()) : i.alert("", "Only Exit Presentation when Online");
                    break;
                case "customize>presentation":
                    navigator.onLine ? ($("#loader").show(), n.go("presentation"), a.all()) : i.alert("", "Only Switch to Presentation when Online");
                    break;
                case "presentation>presentation":
                    navigator.onLine ? t.sessionId || n.go("presentation", {
                        sessionId: r.sessionId
                    }, {
                        notify: r.notify
                    }) : (i.alert("", "Only Switch to Presentation when Online"), n.go("customize"), a.cancel());
                    break;
                default:
                    n.go(s)
            }
        }
    }]), angular.module("app").factory("modalService", ["$uibModal", "$state", "userService", "Analytics", function(n, t, e, a) {
        var i, o = {},
            s = e,
            r = function() {
                return i ? (u("*", !0), R(i, !0), i = null, !0) : (u("Login", !0), u("Register", !0), !1)
            },
            l = function(n, t) {
                if (navigator.onLine) return !0;
                if ("alert" === n) {
                    var e;
                    switch (t) {
                        case "data":
                            e = "Not Editable When Disconnected";
                            break;
                        case "function":
                            e = "Not Doable When Disconnected";
                            break;
                        default:
                            e = "Disconnected"
                    }
                    h("", e)
                }
                return !1
            },
            c = function(n, t) {
                return !!s.authenticated || ("login" === n ? (i = t, S()) : "register" === n && (i = t, D()), !1)
            },
            u = function(n, t) {
                g("dismiss", n), t || a.log("modals", "Dismiss", n)
            },
            d = function(n, t) {
                g("close", n), t || a.log("modals", "Close", n)
            },
            g = function(n, t) {
                var e, a;
                a = "*" === t ? Object.keys(o) : [t];
                for (var i in a) e = a[i], o[e] && "function" == typeof o[e][n] && o[e][n](), o[e] = null
            },
            m = function(t, e, a) {
                return e && u("*", !0), t.animation = !1, t.windowClass = "animation-modal-x", a && (t.backdrop = "static", t.keyboard = !1), n.open(t)
            },
            p = function() {
                if (!l("alert", "function") || !c("login", "Account")) return !1;
                var n = {
                    component: "modalAccount",
                    size: "account-info"
                };
                o.Account = m(n, !0)
            },
            h = function(n, t) {
                var e = {
                    component: "modalAlert",
                    size: "account-info",
                    resolve: {
                        title: function() {
                            return n
                        },
                        message: function() {
                            return t
                        }
                    }
                };
                o.Alert = m(e, !0)
            },
            f = function() {
                if (!l("alert", "data")) return !1;
                var n = {
                    component: "modalBackground",
                    size: "account-info"
                };
                o.Background = m(n, !0)
            },
            y = function() {
                if (!l("alert", "data") || !c("login", "Button")) return !1;
                var n = {
                    component: "modalButton",
                    size: "secondary"
                };
                o.Button = m(n, !0)
            },
            v = function() {
                var n = {
                    component: "modalContact",
                    size: "contact-us"
                };
                o.Contact = m(n, !0)
            },
            b = function() {
                return !(!l("alert", "function") || s.authenticated) && (u("*", !0), void t.go("forgotPassword"))
            },
            w = function() {
                if (!l("alert", "data") || !c("login", "Id")) return !1;
                var n = {
                    component: "modalId",
                    size: "edit"
                };
                o.Id = m(n, !0)
            },
            k = function() {
                var n = {
                    component: "modalIdsResult",
                    size: "result"
                };
                o.IdResult = m(n, !0)
            },
            z = function() {
                var n = {
                    component: "modalIntro",
                    size: "intro"
                };
                o.Intro = m(n, !0)
            },
            P = function() {
                var n = {
                    component: "modalLanguage",
                    size: "language"
                };
                o.Language = m(n, !0)
            },
            S = function() {
                return !(!l("alert", "function") || s.authenticated) && (u("*", !0), void t.go("login"))
            },
            T = function() {
                if (!l("alert", "data") || !c("login", "Message")) return !1;
                var n = {
                    component: "modalMessage",
                    size: "secondary"
                };
                o.Message = m(n, !0)
            },
            C = function(n, t, e) {},
            L = function(n) {
                var t = {
                    component: "modalPayment",
                    size: "edit"
                };
                o.Payment = m(t, !0, n)
            },
            x = function() {
                if (!l("alert", "data") || !c("login", "Prize")) return !1;
                var n = {
                    component: "modalPrize",
                    size: "secondary"
                };
                o.Prize = m(n, !0)
            },
            D = function() {
                return !(!l("alert", "function") || s.authenticated) && (u("*", !0), void t.go("register"))
            },
            I = function() {
                var n = {
                    component: "modalTheme",
                    size: "change-theme"
                };
                o.Theme = m(n, !0)
            },
            N = function(n) {
                var t = {
                    component: "modalSurvey",
                    size: "login-register",
                    resolve: {
                        surveyId: function() {
                            return n
                        }
                    }
                };
                o.Theme = m(t, !0, !0)
            },
            A = {
                Account: p,
                Background: f,
                Button: y,
                Contact: v,
                ForgotPassword: b,
                Id: w,
                IdResult: k,
                Intro: z,
                Language: P,
                Login: S,
                Message: T,
                Payment: L,
                Prize: x,
                Register: D,
                Theme: I
            },
            R = function(n, t, e, i) {
                if (n && A[n]) return !$("div#modal-" + n).length && (A[n](e, i), t || a.log("modals", "Open", n), !0)
            };
        return {
            open: R,
            dismiss: u,
            close: d,
            alert: h,
            notify: C,
            isOnLine: l,
            isAuthenticated: c,
            doLoginOpen: r,
            survey: N
        }
    }]), angular.module("app").factory("defaultIdService", ["$translate", function(n) {
        var t = {
            vi: {
                200001: "Bạn đã trúng thưởng 1 Bếp ga",
                200002: "Bạn đã trúng thưởng 1 Quạt máy",
                200003: "Bạn đã trúng thưởng 1 Thùng bia",
                200004: "Bạn đã trúng thưởng 1 Thùng nước ngọt",
                200005: "Bạn đã trúng thưởng 200.000đ tiền mặt",
                200006: "Bạn đã trúng thưởng 300.000đ tiền mặt ",
                200007: "Bạn đã trúng thưởng 500.000đ tiền mặt ",
                200008: "Bạn đã trúng thưởng 1 Mũ bảo hiểm full face ",
                200009: "Bạn đã trúng thưởng 1 Mũ bảo hiểm Vĩnh Trường",
                200010: "Bạn đã trúng thưởng 1 Áo mưa Vĩnh Trường",
                200011: "Bạn đã trúng thưởng 1 Khẩu trang",
                200012: "Bạn đã trúng thưởng 1 lít xăng ",
                200013: "Bạn đã trúng thưởng 1 Móc khoá",
                200014: "Trúng thưởng thêm 1 lượt quay"
            },
            en: {
                200001: "Bạn đã trúng thưởng 1 Bếp ga",
                200002: "Bạn đã trúng thưởng 1 Quạt máy",
                200003: "Bạn đã trúng thưởng 1 Thùng bia",
                200004: "Bạn đã trúng thưởng 1 Thùng nước ngọt",
                200005: "Bạn đã trúng thưởng 200.000đ tiền mặt",
                200006: "Bạn đã trúng thưởng 300.000đ tiền mặt ",
                200007: "Bạn đã trúng thưởng 500.000đ tiền mặt ",
                200008: "Bạn đã trúng thưởng 1 Mũ bảo hiểm full face ",
                200009: "Bạn đã trúng thưởng 1 Mũ bảo hiểm Vĩnh Trường",
                200010: "Bạn đã trúng thưởng 1 Áo mưa Vĩnh Trường",
                200011: "Bạn đã trúng thưởng 1 Khẩu trang",
                200012: "Bạn đã trúng thưởng 1 lít xăng ",
                200013: "Bạn đã trúng thưởng 1 Móc khoá",
                200014: "Trúng thưởng thêm 1 lượt quay"
            }
        };
        return function() {
            var e = n.use(),
                a = t[e] || t.en;
            return {
                ids: _.keys(a),
                names: _.values(a)
            }
        }
    }]), angular.module("app").factory("i18nService", ["$translate", "$http", "$window", "devOps", "userdataService", function(n, t, e, a, i) {
        var o = navigator.language || navigator.userLanguage,
            s = {
                en: {
                    name: "English",
                    flag: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-gb.jpg"
                },
                cn: {
                    name: "中文",
                    flag: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-china.jpg"
                },
                kr: {
                    name: "한국어",
                    flag: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-korea.jpg"
                },
                vi: {
                    name: "Tiếng Việt",
                    flag: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-vietnam.jpg"
                },
                fr: {
                    name: "Français",
                    flag: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-fr.jpg"
                },
                pt: {
                    name: "Português",
                    flag: "//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-por.jpg"
                }
            },
            r = {};
        angular.forEach(s, function(n, t) {
            e["i18n_" + t] && (r[t] = n)
        });
        var l = function(e) {
                var s = e || i.getRuntimeOpt("language", "undefined");
                "undefined" === s ? t.get(a.api.ipinfo).then(function(t) {
                    var e = t || {},
                        a = e.data || {};
                    s = "VN" === a.country ? "vi" : o.substr(0, 2), n.use(s), i.setRuntimeOpt("language", s)
                }) : (n.use(s), e && i.setRuntimeOpt("language", e))
            },
            c = function() {
                return n.use()
            };
        return {
            languages: r,
            setLang: l,
            getLang: c,
            userLang: o
        }
    }]), angular.module("app").factory("authService", ["$firebaseAuth", function(n) {
        return n()
    }]).factory("firebaseRef", ["authService", function(n) {
        var t = firebase.database().ref();
        return function() {
            var e = n.$getAuth();
            if (e) return t.child(e.uid);
            throw new Error("User not logged in!")
        }
    }]), angular.module("app").factory("audioService", ["defaultSettingService", "devOps", "Analytics", "userdataService", function(n, t, e, a) {
        var i = null,
            o = 0,
            s = {},
            r = {};
        r.mode = parseInt(a.getRuntimeOpt("audioMode", 0)), r.icon = t.audioIcons[r.mode];
        var l = function(t, e) {
                if (null === i || t !== o || e) {
                    var a = n.audio;
                    Object.keys(a).length;
                    i = null, o = t, i = {};
                    for (var s in a)
                        if ("spin" === s) {
                            i.spinHigh = new Audio(a.spin.High);
                            for (var l = 0; l < t; l++) i["spinHigh" + l] = new Audio(a.spin.High)
                        } else "" === a[s] ? i[s] = new Audio : i[s] = new Audio(a[s]);
                    r.mute()
                }
            },
            c = function(n) {
                return i[n] && i[n].src
            },
            u = function(n, t) {
                i[n].loop = "loop" === t || t === !0
            },
            d = function(n, t, e) {
                s[t] && (clearTimeout(s[t]), s[t] = null), e ? s[t] = setTimeout(function() {
                    "play" == n && "background" != t && p(t);
                    try {
                        i[t][n](), s[t] = null
                    } catch (e) {}
                }, e) : ("play" == n && "background" != t && p(t), i[t][n]())
            },
            g = function(n, t, e) {
                return !!c(n) && (u(n, e), void d("play", n, t))
            },
            m = function(n, t) {
                return !!c(n) && void d("pause", n, t)
            },
            p = function(n, t) {
                return !!c(n) && (d("pause", n, t), void(i[n].currentTime = 0))
            },
            h = function(n) {
                return !!c(n) && void(i[n].currentTime = 0)
            };
        return r.toggle = function() {
            r.mode++, r.mode >= t.audioIcons.length && (r.mode = 0), r.icon = t.audioIcons[r.mode], r.mute(), a.setRuntimeOpt("audioMode", r.mode), e.log("ui_action", "Set Audio Mode", r.mode + ". " + r.icon)
        }, r.mute = function() {
            if (0 === r.mode)
                for (var n in i) i[n].muted = !1;
            else if (1 === r.mode) i.background.muted = !0;
            else
                for (var n in i) i[n].muted = !0
        }, {
            init: l,
            play: g,
            pause: m,
            stop: p,
            reset: h,
            controller: r
        }
    }]), angular.module("app").factory("Analytics", ["$window", "devOps", "authService", "trackingEvents", function(n, t, e, a) {
        var i = "",
            o = e,
            s = o.$getAuth(),
            r = {};
        s && (r.authenticated = !0, r.email = s.email, r.uid = s.uid), o.$onAuthStateChanged(function(n) {
            n ? (s = o.$getAuth(), r.authenticated = !0, r.email = s.email, r.uid = s.uid) : r.authenticated = !1
        });
        var l = function(t) {
                if ("undefined" != typeof n.ga && "undefined" != typeof n.ga.getAll) {
                    var e = n.ga.getAll()[0].get("name");
                    n.ga(e + ".send", {
                        hitType: "event",
                        eventCategory: t.category,
                        eventAction: t.action,
                        eventLabel: t.label
                    })
                } else {
                    setTimeout(function() {
                        l(t)
                    }, 1e3)
                }
            },
            c = function(t) {
                if ("undefined" != typeof n.mixpanel) n.mixpanel.track(t.event, t.data);
                else {
                    setTimeout(function() {
                        c(t)
                    }, 1e3)
                }
            },
            u = function(n, e, o, s) {
                if (!a[n]) return void console.error("Undefined tracking event: " + n);
                if ("Hotkey" == e) return i = o, !0;
                var u = {
                    event: a[n],
                    data: {}
                };
                if (e && (u.data.action = e), "undefined" != typeof o && (u.data.label = "string" == typeof o ? o : JSON.stringify(o)), "object" == typeof s)
                    for (var d in s) u.data[d] = s[d];
                i && (u.data.hotkey = i, i = ""), r.uid && (u.data.uid = r.uid);
                var g = new Date;
                if (u.data.moment = g.toLocaleString(), u.data.version = t.version, document.domain !== t.domain) return console.log("Analytics", u), !1;
                c(u);
                var m = {
                    category: u.event,
                    action: u.data.action || null,
                    label: u.data.label || null
                };
                return l(m), !0
            },
            d = function(e, a, i) {
                if (a || (a = r.uid), i || (i = r.email), document.domain !== t.domain) return console.log(e, a, i), !a && void 0;
                if (a) {
                    if (n.intercomSettings && (n.intercomSettings.email = i), "undefined" != typeof n.mixpanel && "function" == typeof n.mixpanel[e]) {
                        n.mixpanel[e](a);
                        var o = {
                            $email: i
                        };
                        "alias" == e ? o.$created = new Date : o.$last_login = new Date, n.mixpanel.people.set(o)
                    } else {
                        setTimeout(function() {
                            d(e, a, i)
                        }, 1e3)
                    }
                    return !0
                }
            },
            g = function(t) {
                t ? n.onbeforeunload = function(n) {
                    u("unload");
                    var t = "o/",
                        e = n || window.event;
                    return e && (e.returnValue = t), t
                } : n.onbeforeunload = function() {}
            };
        return {
            log: u,
            id: d,
            trackUnload: g
        }
    }]).factory("trackingEvents", function() {
        var n = {
            test: "DevOp",
            "default": "Do Something",
            error: "Got Error",
            visit_home: "Visit Home",
            visit_mod: "Visit Customize",
            visit_pres: "Visit Presentation",
            iddraw_home: "ID Draw - Home",
            iddraw_pres: "ID Draw - Presentation",
            modals: "Execute Modals",
            login: "User LogIn",
            register: "User Register",
            logout: "User LogOut",
            edit_profile: "Edit User Profile",
            payment: "Make Payment",
            customize: "Customize",
            ui_action: "Interact UI",
            milestone: "Reach Milestone",
            contact: "Make Contact",
            forgotpw: "Forgot Password",
            onboarding: "Onboarding",
            misused: "Misused",
            unload: "Unload Browser",
            survey: "Answer Survey"
        };
        return n
    }), angular.module("app").provider("$modalState", ["$stateProvider", function(n) {
        var t = this;
        this.$get = function() {
            return t
        }, this.state = function(e, a) {
            function i(n, t, o) {
                a.resolve = {};
                for (var l = i.$inject.length - r.length; l < i.$inject.length; l++) ! function(n, t) {
                    a.resolve[n] = function() {
                        return t
                    }
                }(i.$inject[l], arguments[l]);
                o(function() {
                    a.windowClass = "animation-modal-x", a.animation = !1, s = n.open(a), s.result["finally"](function() {
                        o(function() {
                            t.$current.name === e && t.go(a.parent || "^")
                        })
                    })
                })
            }

            function o() {
                s && s.close()
            }
            var s;
            a.onEnter = i, a.onExit = o, a.resolve || (a.resolve = []);
            var r = angular.isArray(a.resolve) ? a.resolve : Object.keys(a.resolve);
            return n.state(e, _.omit(a, ["component", "template", "templateUrl", "controller", "controllerAs"])), i.$inject = ["$uibModal", "$state", "$timeout"].concat(r), t
        }
    }]);
var i18n_vi = {
        "Lucky Draw": "Quay số trúng thưởng",
        "X Prize": "Giải X",
        "Diamond Prize": "Giải Đặc Biệt",
        "Gold Prize": "Giải Nhất",
        "Silver Prize": "Giải Nhì",
        "Silver Prize": "Giải Nhì",
        "Bronze Prize": "Giải Ba",
        "Press the Spin button to start": "Nhấn nút BẮT ĐẦU để quay giải thưởng",
        "Press the Presentation button to start": "Nhấn Trình chiếu để bắt đầu sự kiện",
        "Winner is coming...": "Vòng quay thưởng may mắn ngẫu nhiên...",
        Spin: "Bắt đầu",
        Stop: "Kết thúc",
        Confirm: "Xác nhận",
        Retry: "Quay lại",
        Customize: "Chỉnh sửa",
        "Register Now": "Đăng ký",
        "Buy Now": "Mua Phần Mềm",
        Presentation: "Trình chiếu!",
        "Draw Now": "Quay Số",
        "Amazing Event": "Hệ Thống Xe Máy Vĩnh Trường - Thiên Vĩnh Trường",
        "Your Event Name": "CHÌA KHOÁ TRAO TAY - VẬN MAY LIỀN TỚI",
        "Winner Name Here": "Người May Mắn",
        Save: "Lưu lại",
        Cancel: "Hủy bỏ",
        "Reset Default": "Mặc định",
        "Edit ID": "Danh sách mã quay thưởng của tôi",
        "Update IDs for Presentation": "Nhập danh sách mã số để quay thưởng",
        "Your Drawing IDs": "Cập nhật danh sách",
        "Or Auto Generate ID": "hoặc tự động tạo số",
        Generate: "Tạo số",
        Total: "Số lượng",
        IDs: "Mã số",
        "IDs ( 0-9, A-Z, maximum 16 characters )": "BƯỚC 1: Copy danh sách Mã số quay thưởng vào đây",
        "ID max length exceeds": "Mỗi mã quay thưởng không được vượt quá 23 ký tự",
        "Name List": "BƯỚC 2: Copy danh sách Họ tên vào đây",
        Names: "Họ tên",
        "ID/Name pairs will be automatically matched line by line": "",
        "Copy Paste lists of IDs/ Names in to corresponding column": "",
        "You’ve reached 15 IDs limit": "Tài khoản thử nghiệm bị giới hạn 3 lần quay ở chế độ Trình chiếu!",
        "Upgrade to Remove Your Account Limits": "",
        "Upgrade to Continue Lucky Drawing": "",
        "Pay to Extend Usage Time": "Gia hạn thời gian sử dụng cho sự kiện tiếp theo của bạn",
        "Pay to Extend Lucky Drawing Time": "Gia hạn để lưu được kết quả quay thưởng",
        "Usage Days": "Quay thưởng không giới hạn trong",
        "per Event": "/ sự kiện",
        "Service Price Guide": "",
        "Upgrade Account Now": "Nâng cấp tài khoản",
        "Return to editing": "Danh sách mã quay thưởng của tôi",
        "Upgrade Account": "Nâng cấp tài khoản",
        "WePay Payment Guide": "Bạn sẽ được chuyển sang cổng thanh toán WePay để thực hiện thanh toán an toàn. Tại trang sohapay.vn, nhấn vào mục 'Thanh toán không cần đăng nhập' để thanh toán nhanh. Tài khoản của bạn sẽ được tự động nâng cấp ngay sau khi hoàn tất giao dịch.",
        "1Pay Payment Guide": "Bạn sẽ được chuyển sang cổng thanh toán 1Pay để thực hiện thanh toán an toàn. Tài khoản của bạn sẽ được tự động nâng cấp ngay sau khi hoàn tất giao dịch.",
        "Paypal Payment Guide": "Bạn sẽ được chuyển sang cổng thanh toán PayPal để thực hiện thanh toán an toàn. Tài khoản của bạn sẽ được tự động nâng cấp ngay sau khi hoàn tất giao dịch.",
        "1 day event": "Event 1 ngày",
        "3 days event": "Event 3 ngày",
        "5 days event": "Event 5 ngày",
        "24 hours": "24 giờ",
        "3 days": "3 ngày",
        "5 days": "5 ngày",
        event1day: "Tặng 2 ngày",
        event3days: "Tặng 3 ngày",
        event5days: "Tặng 4 ngày",
        "for pre-event testing": "sử dụng miễn phí để chuẩn bị trước sự kiện",
        "estimated usage time": "Thời hạn sử dụng (ước tính):",
        until: "đến",
        "Please contact LuckyDraw to manually activate your payment": "Vui lòng liên hệ theo số 0333 444 402 để hoàn tất giao dịch của bạn",
        "Payment Complete": "Thanh toán thành công",
        "Payment completed successfully": "Bạn đã thanh toán và nâng cấp tài khoản thành công",
        "Thanks for being awesome with Lucky Draw": "Cảm ơn bạn đã sử dụng LuckyDraw!",
        "Your subscription": "Ngày nâng cấp tiếp theo",
        "Now you’ll return to edit your custom Photos/ IDs": "",
        "Unable to init payment process. Please try again.": "Không kết nối được tới cổng thanh toán. Vui lòng nhấn F5 và thử lại!",
        "Customize Action Message": "Chỉnh sửa thông báo",
        "Customize name of Prizes": "Đổi tên giải thưởng",
        "Customize Button": "Đổi tên nút bấm",
        "Select Checkbox to Enable Prize": "Hướng dẫn: Đánh dấu chọn để sử dụng các cơ cấu giải.<br />Nhấn vào biểu tượng giải thưởng để thay thế hình ảnh.",
        Pricing: "Phí sử dụng",
        Result: "Kết quả",
        Rejected: "Bỏ qua",
        Confirmed: "Đã xác nhận",
        "ID Drawing Winner": "Kết quả quay số may mắn",
        "Drawing Session": "Phiên quay thưởng",
        "This will delete all prizes in session": "Xóa toàn bộ kết quả trong phiên",
        or: "hay",
        "Draw Date": "Ngày",
        "Winner Name": "Sản phẩm trúng thưởng",
        "No result": "-",
        "Download Results": "Download",
        Diamond: "Đặc biệt",
        Gold: "Giải Nhất",
        Silver: "Giải Nhì",
        Bronze: "Giải Ba",
        "X-Prize": "Giải X",
        "Everybody Win!": "Không còn mã số để quay thưởng. Toàn bộ mã số hoặc đã trúng thưởng, hoặc đã bị loại.",
        Prize: "Giải",
        "Prize 4": "Giải 4",
        "Prize 5": "Giải 5",
        "Prize 6": "Giải 6",
        "Prize 7": "Giải 7",
        "Prize 8": "Giải 8",
        "Prize 9": "Giải 9",
        "Prize 10": "Giải 10",
        "Prize 11": "Giải 11",
        "Prize 12": "Giải 12",
        "Prize 13": "Giải 13",
        "Prize 14": "Giải 14",
        "Prize 15": "Giải 15",
        "Prize 16": "Giải 16",
        "Prize 17": "Giải 17",
        "Prize 18": "Giải 18",
        "Prize 19": "Giải 19",
        "Prize 20": "Giải 20",
        "Prize 21": "Giải 21",
        "Prize 22": "Giải 22",
        "Prize 23": "Giải 23",
        "How-to": "Hướng dẫn",
        Introduction: "Giới thiệu",
        "About Us": "Về XEMAYVINHTRUONG.VN",
        FAQ: "Câu hỏi thường gặp",
        "Term of Service": "Quy định sử dụng",
        "Privacy Policy": "Chính sách bảo mật",
        "Contact and Support": "Liên hệ và Hỗ trợ",
        "templates/tab-about.html": "templates/vi/tab-about.html",
        "templates/tab-faq.html": "templates/vi/tab-faq.html",
        "templates/tab-term.html": "templates/tab-term.html",
        "templates/tab-policy.html": "templates/tab-policy.html",
        "templates/tab-contact.html": "templates/tab-contact.html",
        Login: "Đăng nhập",
        Email: "Email",
        Password: "Mật khẩu",
        "Not a member": "Bạn chưa có tài khoản",
        "Sign up now": "Đăng ký ngay",
        "Don't have an account?": "",
        "Account is being used": "Tài khoản đang được sử dụng ở một nơi khác",
        "Someone logged-in somewhere!": "Tài khoản của bạn đã được đăng nhập và sử dụng ở một nơi khác. Để đảm bảo an toàn dữ liệu, vui lòng chỉ đăng nhập tài khoản trên một máy tính tại một thời điểm.",
        "Login to continue": "Đăng nhập để tiếp tục",
        Register: "Đăng ký tài khoản",
        Company: "Tên công ty",
        "Your Name": "Họ tên",
        "ABC Company": "họ và tên của bạn",
        "abcd@gmail.com": "nhập email của bạn",
        "Send me LuckyDraw newsletters": "Gửi cho tôi các bản tin LuckyDraw (3 email / 365 ngày)",
        "Return to Login form": "Quay trở lại form đăng nhập",
        "Return to": "Bạn đã có tài khoản?",
        "Login form": "Đăng nhập",
        "Already have an account?": "Bạn đã có tài khoản?",
        "Login / Register": "Đăng nhập",
        "You can create your own lucky drawing list after registration": "Bạn có thể tự tạo danh sách quay thưởng sau khi đăng ký tài khoản",
        "Forgot password": "Quên mật khẩu",
        "Send email": "Gửi Email",
        "Reset Password": "Khôi phục mật khẩu",
        "Please check your email for reset password instruction": "Hướng dẫn khôi phục mật khẩu đã được gửi tới email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn để thiết lập lại mật khẩu và đăng nhập vào tài khoản của bạn.",
        "Enter your registered email": "Nhập email bạn đã dùng khi đăng ký tài khoản",
        Logout: "Đăng xuất",
        Exit: "Thoát",
        Finish: "Kết thúc",
        "Account Info": "Tài khoản",
        "Account information": "Tài khoản của tôi",
        "Account Type": "Loại tài khoản",
        "Paid Account": "VIP",
        "Free Account": "Thử nghiệm",
        "Expired Account": "Hết hạn sử dụng",
        "Last Payment": "Ngày nâng cấp",
        "Expiration Date": "Ngày hết hạn",
        "Change Password": "Đổi mật khẩu",
        "Current password": "Mật khẩu hiện tại",
        "New password": "Mật khẩu mới",
        "Re-enter": "Nhập lại",
        Logo: "Logo",
        "Pay to Extend": "Gia hạn Sử dụng",
        "Pay to Upgrade": "Nâng cấp Tài khoản",
        "Pay Now": "Thanh Toán",
        "Change theme": "LuckyDraw Theme",
        "Select a color theme that match your brand or event": "Thay đổi màu sắc phù hợp với thương hiệu, sự kiện của bạn",
        "Change language": "Language",
        "Change Background": "Thay đổi hình nền",
        "Upload New Background": "Upload hình mới",
        "Remove Background": "Xóa hình nền",
        "Contact us": "Liên hệ / Hỗ trợ",
        "Contact Name": "Người liên hệ",
        Inquiry: "Nội dung",
        Submit: "Gửi đi",
        "Your message has been sent successfully to LuckyDraw team!": "Yêu cầu của bạn đã được gửi tới LuckyDraw team!",
        "Unable to send your message": "Xin lỗi bạn, chức năng gửi yêu cầu tạm thời bị gián đoạn. Vui lòng gửi yêu cầu qua email tới địa chỉ chusunpro@gmail.com",
        "Theme Purple": "Tím",
        "Theme Navy": "Xanh Navy",
        "Theme Olive": "Màu Olive",
        "Theme Orange": "Cam",
        "Theme Black": "Đen",
        "Theme Blue": "Xanh da trời",
        "Theme Green": "Xanh lá cây",
        "Theme Red": "Đỏ",
        "Theme Silver": "Bạc",
        "Theme Aqua": "Màu Aqua",
        "Theme Yellow": "Vàng",
        "Theme White": "Trắng",
        DateTimeFormat: "DD/MM/YYYY, HH:mm:ss",
        shortDateTimeFormat: "DD/MM/YYYY",
        Done: "Hoàn thành",
        Info: "Thông báo",
        guide_shortcut_Enter: "Phím tắt: bấm Enter trên bàn phím để Quay số",
        guide_shortcut_EnterAgain: "Nhấn Enter lần nữa để Chốt số",
        guide_shortcut_AcceptCancel: "Nhấn phím + để Xác nhận; phím - để Quay lại",
        guide_shortcut_LeftRight: "Dùng phím Trái/Phải hoặc 4/6 để chọn giải",
        guide_Completed: "Tuyệt vời! Bạn hãy đăng nhập để tải danh sách quay số riêng.",
        "Reload to Update New Version": "Có bản cập nhật mới của LuckyDraw! Vui lòng nhấn đồng thời hai phím Ctrl+F5 để tải lại trang web với các tính năng mới nhất.",
        "Please open customize page with WiFi": "Vui lòng truy cập trang này khi đang có kết nối Internet để tải dữ liệu trước, nếu không chế độ quay số offline sẽ không thể hoạt động.",
        "Not Editable When Disconnected": "Bạn cần kết nối mạng để có thể cập nhật dữ liệu.",
        "Not Doable When Disconnected": "Bạn cần kết nối mạng để thực hiện thao tác này.",
        Disconnected: "Bạn đang bị mất kết nối Internet!",
        "Only Switch to Presentation when Online": "Vui lòng kết nối Internet trước khi chuyển sang chế độ Quay số (Trình chiếu). Sau đó bạn có thể ngắt kết nối và phần mềm vẫn hoạt động bình thường.",
        "Only Exit Presentation when Online": "Để ngừng chế độ Quay số bạn cần kết nối máy tính vào mạng Internet."
    },
    i18n_en = {
        "Lucky Draw": "Lucky Draw",
        "X Prize": "X Prize",
        "Diamond Prize": "Diamond Prize",
        "Gold Prize": "Gold Prize",
        "Silver Prize": "Silver Prize",
        "Silver Prize": "Silver Prize",
        "Bronze Prize": "Bronze Prize",
        "Press the Spin button to start": "Press the Spin button to start",
        "Press the Presentation button to start": "Press the button below to start the show",
        "Winner is coming...": "Winner is coming...",
        Spin: "Spin",
        Stop: "Stop",
        Confirm: "Confirm",
        Retry: "Reject",
        Customize: "Customize",
        "Register Now": "Register",
        "Buy Now": "Buy Now",
        Presentation: "Presentation",
        "Draw Now": "Draw Now",
        "Amazing Event": "Hệ Thống Xe Máy Vĩnh Trường - Thiên Vĩnh Trường",
        "Your Event Name": "CHÌA KHOÁ TRAO TAY - VẬN MAY LIỀN TỚI",
        "Winner Name Here": "Winner Name Here",
        Save: "Save",
        Cancel: "Cancel",
        "Reset Default": "Reset",
        "Edit ID": "My ID List",
        "Update IDs for Presentation": "You Need A Few IDs To Start Lucky Drawing",
        "Your Drawing IDs": "Update IDs",
        "Or Auto Generate ID": "or auto generate",
        Generate: "Generate",
        Total: "Total",
        IDs: "IDs",
        "IDs ( 0-9, A-Z, maximum 16 characters )": "STEP 1: Paste your ID list here",
        "ID max length exceeds": "A single ID can not exceeds 23 characters",
        "Name List": "STEP 2: Paste your Name list here",
        Names: "Names",
        "ID/Name pairs will be automatically matched line by line": "",
        "Copy Paste lists of IDs/ Names in to corresponding column": "",
        "You’ve reached 15 IDs limit": "Free account is limited to 3 trial drawings!",
        "Upgrade to Remove Your Account Limits": "",
        "Upgrade to Continue Lucky Drawing": "",
        "Pay to Extend Usage Time": "Pay Now to Extend Usage Time For Your Next Event",
        "Pay to Extend Lucky Drawing Time": "Pay Now to Save Drawing Results",
        "Usage Days": "Unlimited lucky drawing results for",
        "per Event": "per Event",
        "Service Price Guide": "",
        "Upgrade Account Now": "Upgrade Account Now",
        "Return to editing": "Edit my ID list",
        "Upgrade Account": "Upgrade Account",
        "WePay Payment Guide": "You will be redirected to the WePay website to complete your secure payment.",
        "1Pay Payment Guide": "You will be redirected to the 1Pay website to complete your secure payment.",
        "Paypal Payment Guide": "You will be redirected to the Paypal website to complete your secure payment.",
        "1 day event": "1 day event",
        "3 days event": "3 days event",
        "5 days event": "5 days event",
        "24 hours": "24 hours",
        "3 days": "3 days",
        "5 days": "5 days",
        event1day: "+2 days free",
        event3days: "+3 days free",
        event5days: "+4 days free",
        "for pre-event testing": "for pre-event testing",
        "estimated usage time": "Estimated usage time:",
        until: "until",
        "Please contact LuckyDraw to manually activate your payment": "Please contact LuckyDraw to manually activate your payment",
        "Payment Complete": "Payment Completed",
        "Payment completed successfully": "You've Upgraded Your Account Successfully",
        "Thanks for being awesome with Lucky Draw": "Thank You For Being Awesome with Lucky Draw!",
        "Your subscription": "Valid until",
        "Now you’ll return to edit your custom Photos/ IDs": "",
        "Unable to init payment process. Please try again.": "Unable to init payment process. Please try again.",
        "Customize Action Message": "Customize Messages",
        "Customize name of Prizes": "Customize Prizes",
        "Customize Button": "Customize Buttons",
        "Select Checkbox to Enable Prize": "Hint: Select check boxes to enable the prizes.<br />Click the icons on the right to upload replacements.",
        Pricing: "Pricing",
        Result: "Result",
        Rejected: "Rejected",
        Confirmed: "Confirmed",
        "ID Drawing Winner": "Lucky IDs",
        "Drawing Session": "Session",
        "This will delete all prizes in session": "This will delete all prizes in session",
        or: "or",
        "Draw Date": "Date",
        "Winner Name": "Name",
        "No result": "-",
        "Download Results": "Download",
        Diamond: "Diamond",
        Gold: "Gold",
        Silver: "Silver",
        Bronze: "Bronze",
        "X-Prize": "X Prize",
        "Everybody Win!": "No IDs available to draw. All IDs are either won or rejected.",
        Prize: "Prize",
        "Prize 4": "Prize 4",
        "Prize 5": "Prize 5",
        "Prize 6": "Prize 6",
        "Prize 7": "Prize 7",
        "Prize 8": "Prize 8",
        "Prize 9": "Prize 9",
        "Prize 10": "Prize 10",
        "Prize 11": "Prize 11",
        "Prize 12": "Prize 12",
        "Prize 13": "Prize 13",
        "Prize 14": "Prize 14",
        "Prize 15": "Prize 15",
        "Prize 16": "Prize 16",
        "Prize 17": "Prize 17",
        "Prize 18": "Prize 18",
        "Prize 19": "Prize 19",
        "Prize 20": "Prize 20",
        "Prize 21": "Prize 21",
        "Prize 22": "Prize 22",
        "Prize 23": "Prize 23",
        "How-to": "How-to",
        Introduction: "Introduction",
        "About Us": "About Us",
        FAQ: "FAQ",
        "Term of Service": "Terms of Service",
        "Privacy Policy": "Privacy Policy",
        "Contact and Support": "Contact and Support",
        "templates/tab-about.html": "templates/tab-about.html",
        "templates/tab-faq.html": "templates/tab-faq.html",
        "templates/tab-term.html": "templates/tab-term.html",
        "templates/tab-policy.html": "templates/tab-policy.html",
        "templates/tab-contact.html": "templates/tab-contact.html",
        Login: "Login",
        Email: "Email",
        Password: "Password",
        "Not a member": "Not a member",
        "Sign up now": "Sign up now",
        "Don't have an account?": "Don't have an account?",
        "Account is being used": "Your account is being used somewhere else",
        "Someone logged-in somewhere!": "Your account is being logged-in on a different device elsewhere. To keep your account's data safe, please only log-in on one device at a time.",
        "Login to continue": "Login to continue",
        Register: "Register",
        Company: "Company",
        "Your Name": "Your Name",
        "ABC Company": "enter your name",
        "abcd@gmail.com": "enter your email",
        "Send me LuckyDraw newsletters": "Send me LuckyDraw newsletters (3 emails / year)",
        "Return to Login form": "Return to Login form",
        "Return to": "Return to",
        "Login form": "Login form",
        "Already have an account?": "Already have an account?",
        "Login / Register": "Login",
        "You can create your own lucky drawing list after registration": "You can create your own lucky drawing list after registration",
        "Forgot password": "Forgot password",
        "Send email": "Send email",
        "Reset Password": "Reset Password",
        "Please check your email for reset password instruction": "Please check your inbox for an email we just sent you with instructions for how to reset your password and log into your account.",
        "Enter your registered email": "Enter your registered email",
        Logout: "Logout",
        Exit: "Exit",
        Finish: "Finish",
        "Account Info": "Account",
        "Account information": "My Account",
        "Account Type": "Account Type",
        "Paid Account": "Paid",
        "Free Account": "Free",
        "Expired Account": "Expired",
        "Last Payment": "Last Payment",
        "Expiration Date": "Expiration Date",
        "Change Password": "Change Password",
        "Current password": "Current Password",
        "New password": "New Password",
        "Re-enter": "Re-enter Password",
        Logo: "Logo",
        "Pay to Extend": "Extend Usage Time",
        "Pay to Upgrade": "Upgrade Account",
        "Pay Now": "Pay Now",
        "Change theme": "LuckyDraw Theme",
        "Select a color theme that match your brand or event": "Select a color theme that match your brand",
        "Change language": "Language",
        "Change Background": "Change Background",
        "Upload New Background": "Upload New",
        "Remove Background": "Remove Background",
        "Contact us": "Contact us",
        "Contact Name": "Your Name",
        Inquiry: "Message",
        Submit: "Submit",
        "Your message has been sent successfully to LuckyDraw team!": "Your message has been sent successfully to LuckyDraw team!",
        "Unable to send your message": "It looks like an unexpected technical issue is preventing the submission of your form. Please send you request via email to chusunpro@gmail.com instead.",
        "Theme Purple": "Purple",
        "Theme Navy": "Navy",
        "Theme Olive": "Olive",
        "Theme Orange": "Orange",
        "Theme Black": "Black",
        "Theme Blue": "Blue",
        "Theme Green": "Green",
        "Theme Red": "Red",
        "Theme Silver": "Silver",
        "Theme Aqua": "Aqua",
        "Theme Yellow": "Yellow",
        "Theme White": "White",
        DateTimeFormat: "MMM Do YYYY, HH:mm:ss",
        shortDateTimeFormat: "MMM Do YYYY",
        Done: "Done",
        Info: "Info",
        guide_shortcut_Enter: "Hint: press Enter on the keyboard to Spin",
        guide_shortcut_EnterAgain: "Press Enter again to Stop",
        guide_shortcut_AcceptCancel: "Press + or Space key to Accept; - or Del to Cancel",
        guide_shortcut_LeftRight: "Press Left/Right or 4/6 keys to switch prize",
        guide_Completed: "You're Awesome! Now login to upload your own drawing IDs.",
        "Reload to Update New Version": "LuckyDraw updates available! Please press Ctrl+F5 to reload the website with latest features.",
        "Please open customize page with WiFi": "No Internet connection available! Please visit this page while being connected to the Internet to load your data first, otherwise the offline mode will not work.",
        "Not Editable When Disconnected": "Please connect to the Internet to edit data.",
        "Not Doable When Disconnected": "Please connect to the Internet for this function to work.",
        Disconnected: "You have no Internet connection available!",
        "Only Switch to Presentation when Online": "Please connect to the Internet first to switch to Presentation mode. After that you can disconnect and perform lucky drawing in offline mode.",
        "Only Exit Presentation when Online": "Unable to exit Presentation mode while working offline."
    };
angular.module("app").component("notification", {
    controller: notificationController
}), angular.module("app").component("modalTheme", {
    templateUrl: "components/modal-theme.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: ThemeController
}), angular.module("app").component("modalSurvey", {
    templateUrl: "components/modal-survey.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: SurveyController
}), angular.module("app").component("modalRegister", {
    templateUrl: "components/modal-register.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&",
        error: "<"
    },
    controller: RegisterController
}), angular.module("app").component("modalPrize", {
    templateUrl: "components/modal-prize.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: PrizeController
}), angular.module("app").component("modalPayment", {
    templateUrl: "components/modal-payment.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&",
        error: "<"
    },
    controller: PaymentController
}).component("paymentIntro", {
    templateUrl: "templates/payment-form/payment-intro.html",
    bindings: {},
    controller: PaymentIntroController
}).component("paymentButton", {
    templateUrl: "templates/payment-form/payment-button.html",
    bindings: {},
    controller: PaymentButtonController
}).component("paypalPaymentForm", {
    templateUrl: "templates/payment-form/paypal.html",
    bindings: {},
    controller: PaypalPaymentController
}).component("sohaPaymentForm", {
    templateUrl: "templates/payment-form/soha.html",
    bindings: {},
    controller: SohaPaymentController
}), angular.module("app").component("modalNotify", {
    templateUrl: "components/modal-notify.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&",
        error: "<"
    },
    controller: NotifyController
}), angular.module("app").component("modalMessage", {
    templateUrl: "components/modal-message.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: MessageController
}), angular.module("app").component("modalLogin", {
    templateUrl: "components/modal-login.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: LoginController
}), angular.module("app").component("modalLanguage", {
    templateUrl: "components/modal-language.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: LanguageController
}), angular.module("app").component("modalIntro", {
    templateUrl: "components/modal-intro.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: IntroController
}), angular.module("app").component("modalIdsResult", {
    templateUrl: "components/modal-ids-result.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: IdsResultController
}), angular.module("app").component("modalId", {
    templateUrl: "components/modal-id.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: IdController
}), angular.module("app").component("modalForgotPassword", {
    templateUrl: "components/modal-forgot-password.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: ForgotPasswordController
}), angular.module("app").component("modalContact", {
    templateUrl: "components/modal-contact.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: ContactController
}), angular.module("app").component("modalButton", {
    templateUrl: "components/modal-button.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: ButtonController
}), angular.module("app").component("modalBackground", {
    templateUrl: "components/modal-background.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: BackgroundController
}), angular.module("app").component("modalAlert", {
    templateUrl: "components/modal-alert.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: AlertController
}), angular.module("app").component("modalAccount", {
    templateUrl: "components/modal-account.html",
    bindings: {
        modalInstance: "<",
        resolve: "<",
        close: "&",
        dismiss: "&"
    },
    controller: AccountController
}), angular.module("app").component("idLuckyDraw", {
    templateUrl: "components/luckydraw-id.html",
    bindings: {
        data: "<",
        setting: "<",
        results: "=",
        isLimited: "&"
    },
    controller: IdLuckyDrawController
}), angular.module("app").component("hotKeys", {
    bindings: {
        enter: "&",
        confirm: "&",
        cancel: "&",
        prev: "&",
        next: "&",
        nextstep: "&"
    },
    controller: HotKeysController
}), angular.module("app").component("appFooter", {
    templateUrl: "components/footer.html",
    bindings: {
        lightOff: "<"
    },
    controller: FooterController
}), angular.module("app").directive("offline", offlineDirective), angular.module("app").directive("appbackground", appbackgroundDirective), angular.module("app").controller("PresentationController", PresentationController), angular.module("app").controller("ModController", ModController), angular.module("app").controller("MainController", MainController), angular.module("app").run(["$templateCache", function(n) {
    n.put("index.html", '<!doctype html>\n<html>\n\n<head>\n  <base href="/">\n  <meta charset="utf-8">\n  \n  <title>Lucky Draw</title>\n  <meta name="author" content="quayso.xemayvinhtruong.vn">\n  <meta name="robots" content="index follow">\n  <meta name="googlebot" content="index follow">\n  <meta name="keywords" content="lucky draw, random name picker, random number generator">\n  <meta name="description" content="World\'s most sophisticated random number generator.">\n\n  \n  <meta property="og:title" content="Lucky Draw">\n  <meta property="og:site_name" content="XEMAYVINHTRUONG.VN">\n  <meta property="og:url" content="https://quayso.xemayvinhtruong.vn">\n  <meta property="og:description" content="World\'s most sophisticated random number generator.">\n  <meta property="og:type" content="website">\n  <meta property="og:image" content="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/luckydraw-v1.png">\n\n  <meta name="viewport" content="width=device-width" id="viewportMeta">\n  <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">\n\n  <style>\n    .loader-block {\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      height: 100%;\n      display: block;\n      z-index: 999999;\n      position: fixed;\n      text-align: center;\n      background-color: #ffffff;\n      background-image: url(//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/loader.svg);\n      background-position: center center;\n      background-repeat: no-repeat;\n    }\n  </style>\n  \n  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':\n  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\n  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\n  \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);\n  })(window,document,\'script\',\'dataLayer\',\'GTM-NWZ9HX7\');</script>\n  \n</head>\n\n<body ng-app="app" ng-class="\'theme-\' + theme">\n  \n  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NWZ9HX7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n  \n\n  <div class="loader-block" id="loader"></div>\n  \n  \n  \n  \n  \n\n  \n  <link rel="stylesheet" href="index.css">\n  \n  <div class="wrapper" ng-style="{\'background-image\': url_background}">\n    <ui-view></ui-view>\n    <notification></notification>\n    <img ng-src="{{background}}" width="1" height="1" appbackground>\n  </div>\n\n  \n  \n  \n  \n  \n\n  \n  \n  \n  \n  \n  \n  \n  \n</body>\n\n</html>\n'),
        n.put("components/footer.html", '<footer class="footer">\n  <div class="container-fluid">\n    <div class="row">\n      <div class="col-xs-12">\n        <nav class="footer-nav" ng-class="$ctrl.lightOff ? \'light-off\' : \'light-on\'">\n          <ul>\n            <li ng-if="$ctrl.appState.name !== \'presentation\'">\n              <a ng-click="$ctrl.modals.open(\'IdResult\')" ng-mouseover="$ctrl.ux.mOver(\'IdResult\')" ng-mouseleave="$ctrl.ux.mLeave(\'IdResult\')">\n                <span class="keyboard-key idresult-key" ng-if="$ctrl.ux.hint.IdResult"><span>R</span></span>\n                <i class="ion-android-funnel"></i>\n                <translate>Result</translate>\n              </a>\n            </li>\n\n            <li ng-if="$ctrl.appState.name !== \'presentation\'">\n              <a ng-click="$ctrl.modals.open(\'Intro\')">\n                <i class="ion-android-list"></i>\n                <translate>How-to</translate>\n              </a>\n            </li>\n\n            <li ng-if="$ctrl.appState.name !== \'presentation\'">\n              <a ng-click="$ctrl.modals.open(\'Payment\')">\n                <i class="ion-pricetag"></i>\n                <translate>Pricing</translate>\n              </a>\n            </li>\n\n            <li ng-if="$ctrl.appState.name === \'presentation\'">\n              <a ng-click="$ctrl.navigate(\'customize\', \'\')">\n                <i class="ion-android-exit"></i>\n                <translate>Finish</translate>\n              </a>\n            </li>\n\n            <li ng-if="$ctrl.appState.name !== \'presentation\'">\n              <a ui-sref="customize" ng-if="!$ctrl.user.authenticated" ng-click="$ctrl.analytics.log(\'ui_action\', \'Execute\', \'Link - Footer Login\')">\n                <i class="ion-person"></i>\n                <translate>Login / Register</translate>\n              </a>\n              <a ng-click="$ctrl.modals.open(\'Account\')" ng-if="$ctrl.user.authenticated">\n                <i class="ion-person"></i>\n                <translate>Account Info</translate>\n              </a>\n            </li>\n\n            <li ng-if="$ctrl.appState.name !== \'presentation\' && $ctrl.user.authenticated">\n              <a ng-click="$ctrl.analytics.log(\'logout\');$ctrl.user.logout();">\n                <i class="ion-android-exit"></i>\n                <translate>Logout</translate>\n              </a>\n            </li>\n          </ul>\n        </nav>\n        \n\n        <ul class="list-actions" ng-if="$ctrl.appState.name !== \'presentation\'">\n          <li>\n            <a ng-click="$ctrl.modals.open(\'Background\')" ng-class="$ctrl.ux.cssIntro.infobackground">\n              <i class="ion-image"></i>\n            </a>\n          </li>\n          <li>\n            <a ng-click="$ctrl.modals.open(\'Theme\')" ng-class="$ctrl.ux.cssIntro.runtimetheme">\n              <i class="ion-android-color-palette"></i>\n            </a>\n          </li>\n          <li>\n            <a ng-click="$ctrl.modals.open(\'Language\')">\n              <i class="ion-android-globe"></i>\n            </a>\n          </li>\n          <li>\n            <a ng-click="$ctrl.modals.open(\'Contact\')">\n              <i class="ion-email"></i>\n            </a>\n          </li>\n          <li>\n            <a ng-click="$ctrl.audio.controller.toggle()" ng-mouseover="$ctrl.ux.mOver(\'audio\')" ng-mouseleave="$ctrl.ux.mLeave(\'audio\')">\n              <i ng-class="$ctrl.audio.controller.icon"></i>\n              <span class="keyboard-key audio-key" ng-if="$ctrl.ux.hint.audio"><span>M</span></span>\n            </a>\n          </li>\n        </ul>\n      </div>\n      \n    </div>\n    \n  </div>\n</footer>\n\n'), n.put("components/luckydraw-id.html", '<header class="header">\n  <div class="container-fluid">\n    <div class="row">\n      \n      <div class="logo-zone hidden">\n        <img class="logo" ng-class="$ctrl.lightOff ? \'light-off\' : \'light-on\'" ng-if="$ctrl.setting.info.logo" ng-src="{{$ctrl.setting.info.logo}}">\n      </div>\n      \n\n      <div class="col-xs-12">\n        \n        <h1>\n          <span class="event-name" ng-if="$ctrl.appState.name !== \'presentation\'">\n            {{$ctrl.defaultSetting.info.name | translate}}\n          </span>\n          <span class="event-name" ng-if="$ctrl.appState.name === \'presentation\' && $ctrl.setting.info.name" ng-style="{\'color\': $ctrl.setting.colors.name}">\n            {{$ctrl.setting.info.name}}\n          </span>\n\t\t\t\t</h1><p><span class="event-name-cs">"CHÌA KHÓA TRAO TAY - VẬN MAY LIỀN TỚI"</span></p>\n        \n\n        <div class="header-content hidden">\n          \n          <span class="link-company" ng-if="$ctrl.setting.info.company" ng-style="$ctrl.ux.style($ctrl.setting.colors.action_msg, 1)">\n            {{$ctrl.setting.info.company}}\n          </span>\n          \n        </div>\n      </div>\n    </div>\n  </div>\n</header>\n\n<div ng-class="$ctrl.appState.name === \'presentation\' ? \'main-padding\' : \'main\'">\n  <div class="container-fluid">\n    <div class="row">\n      <div class="col-xs-12">\n        <section class="section section-prize">\n          <header class="section-head" ng-class="$ctrl.animClass.setprize" ng-init="$ctrl.setPrize(0)">\n            \n            <div class="coin hidden">\n              <img class="prize-image" ng-repeat="prize in $ctrl.prizes" ng-src="{{prize.image}}" ng-show="$ctrl.prizeIndex == $index && prize.showimage">\n            </div>\n            \n          </header>\n\n          \n          <div class="ttkh"><span>Khách hàng:</span><input id="field-company" placeholder="Họ tên"/><span>Số điện thoại:</span><input id="field-phone" placeholder="Số điện thoại"/></div><div class="section-message">\n            <h2 ng-style="$ctrl.ux.style($ctrl.setting.colors.action_msg, 1)" ng-class="$ctrl.animClass.message" ng-switch on="$ctrl.state">\n              <span ng-switch-when="ready" class="state-ready">{{$ctrl.setting.messages.start || ($ctrl.defaultSetting.messages.start | translate)}}</span>\n              <span ng-switch-when="spin" class="state-spin">{{$ctrl.setting.messages.wait || ($ctrl.defaultSetting.messages.wait | translate)}}</span>\n              <span ng-switch-when="reveal"><i class="no-text-shadow ion-load-c rotation"></i></span>\n              <span ng-switch-when="complete|toconfirm|confirmed|cancel" ng-switch-when-separator="|" class="winner-name" ng-bind-html="$ctrl.namex"></span>\n            </h2>\n          </div>\n          \n\n          <div class="section-body hidden" ng-class="$ctrl.animClass.setprize">\n            <div class="section-body-inner section-body-inner-primary">\n              <ul class="slots">\n                \n                <li class="slot" ng-repeat="n in $ctrl.machineSlots" ng-class="\'slot-1of\'+$ctrl.slotsCss + \' state-\'+$ctrl.state">\n                  <div class="slot-item" ng-repeat="i in $ctrl.characters[n]">\n                    <div class="slot-number" ng-switch on="$ctrl.state">\n                      <span ng-switch-when="ready">\n                        <img ng-src="{{$ctrl.prize.image}}">\n                      </span>\n                      <span ng-switch-when="setprize"></span>\n                      <span ng-switch-default>{{i}}</span>\n                      \n                    </div>\n                  </div>\n                  \n                  <div class="slot-item" ng-if="!$ctrl.characters[n]">\n                    <div class="slot-number">\n                      <span ng-class="$ctrl.state !== \'ready\' ? \'not-available\' : \'available\'"><img ng-src="{{$ctrl.prize.image}}"></span>\n                    </div>\n                  </div>\n                  \n                </li>\n                \n              </ul>\n            </div>\n          </div>\n\n          <div class="section-actions">\n            <div class="section-head-actions hidden">\n              \n              <a class="link-prev" ng-mouseover="$ctrl.ux.mOver(\'prevnext\')" ng-mouseleave="$ctrl.ux.mLeave(\'prevnext\')" ng-class="$ctrl.state !== \'ready\' || $ctrl.prizeIndex <= 0 ? \'not-available\' : \'available\'" ng-click="$ctrl.setPrize($ctrl.prizeIndex - 1)">\n                <span class="keyboard-key prev-key" ng-if="$ctrl.ux.hint.prevnext"><span>&leftarrow;</span></span>\n                <i class="ion-chevron-left"></i>\n              </a>\n              \n  \n              \n              <span class="prize-text">\n                {{$ctrl.setting.prizes[$ctrl.prize.key] || ($ctrl.defaultSetting.prizes[$ctrl.prize.key] | translate)}}\n              </span>\n              \n  \n              \n              <span class="prize-text prize-count ion-person-add" ng-class="$ctrl.animClass.prizecount" ng-show="$ctrl.prizes[$ctrl.prizeIndex].confirmed">\n                {{$ctrl.prizes[$ctrl.prizeIndex].confirmed}}\n              </span>\n              \n  \n              \n              <a class="link-next" ng-mouseover="$ctrl.ux.mOver(\'prevnext\')" ng-mouseleave="$ctrl.ux.mLeave(\'prevnext\')" ng-class="$ctrl.state !== \'ready\' || $ctrl.prizeIndex >= $ctrl.prizes.length - 1 ? \'not-available\' : \'available\'" ng-click="$ctrl.setPrize($ctrl.prizeIndex + 1)">\n                <i class="ion-chevron-right"></i>\n                <span class="keyboard-key next-key" ng-if="$ctrl.ux.hint.prevnext"><span>&rightarrow;</span></span>\n              </a>\n              \n            </div>\n\n            <div ng-switch on="$ctrl.state" class="section-button">\n              <div ng-switch-when="ready" class="state-ready">\n                <a class="btn btn-yellow btn-yellow-secondary" ng-click="$ctrl.spin()" ng-mouseover="$ctrl.ux.mOver(\'spin\')" ng-mouseleave="$ctrl.ux.mLeave(\'spin\')">\n                  <span class="keyboard-key spin-key" ng-if="$ctrl.ux.hint.spin"><span>ENTER</span></span>\n                  {{$ctrl.setting.buttons.spin || ($ctrl.defaultSetting.buttons.spin | translate)}}\n                </a>\n                <span ng-if="$ctrl.appState.name !== \'customize\' && $ctrl.appState.name !== \'presentation\'">\n                  <a ng-if="$ctrl.user.authenticated" ui-sref="customize" ng-click="$ctrl.analytics.log(\'ui_action\', \'Execute\', \'Button - Customize\')" class="btn btn-primary">\n                    <translate>Customize</translate>\n                  </a>\n                  <a ng-if="!$ctrl.user.authenticated" ui-sref="register" ng-click="$ctrl.analytics.log(\'ui_action\', \'Execute\', \'Button - Customize\')" class="btn btn-primary hidden">\n                    <translate>Register Now</translate>\n                  </a>\n                </span>\n              </div>\n\n              <div ng-switch-when="spin" class="state-spin">\n                <a class="btn btn-yellow btn-yellow-secondary-alt" ng-click="$ctrl.startstop()" ng-mouseover="$ctrl.ux.mOver(\'stop\')" ng-mouseleave="$ctrl.ux.mLeave(\'stop\')">\n                  <span class="keyboard-key stop-key" ng-if="$ctrl.ux.hint.stop"><span>ENTER</span></span>\n                  {{$ctrl.setting.buttons.stop || ($ctrl.defaultSetting.buttons.stop | translate)}} {{$ctrl.remainStops > 0 ? \'(\'+$ctrl.remainStops+\')\' : \'\'}}\n                </a>\n              <div class="stop-des">Nhấn KẾT THÚC để nhận giải thưởng</div>\n </div>\n\n              <div ng-switch-when="complete" class="state-complete">\n                <a class="btn btn-yellow btn-yellow-secondary" ng-click="$ctrl.save()" ng-mouseover="$ctrl.ux.mOver(\'confirm\')" ng-mouseleave="$ctrl.ux.mLeave(\'confirm\')">\n                  <span class="keyboard-key confirm-key" ng-if="$ctrl.ux.hint.confirm"><span>+</span></span>\n                  {{$ctrl.setting.buttons.confirm || ($ctrl.defaultSetting.buttons.confirm | translate)}}\n                </a>\n                <a class="btn btn-primary hidden" ng-click="$ctrl.retry()" ng-mouseover="$ctrl.ux.mOver(\'confirm\')" ng-mouseleave="$ctrl.ux.mLeave(\'confirm\')">\n                  {{$ctrl.setting.buttons.retry || ($ctrl.defaultSetting.buttons.retry | translate)}}\n                  <span class="keyboard-key retry-key" ng-if="$ctrl.ux.hint.confirm"><span>−</span></span>\n                </a>\n              </div>\n            </div> \n\n          </div> \n        </section>\n      </div>\n    </div>\n  </div>\n</div> \n\n<app-footer light-off="$ctrl.lightOff"></app-footer>\n\n<hot-keys enter="$ctrl.startstop()" nextstep="" confirm="$ctrl.save()" cancel="$ctrl.retry()" prev="$ctrl.setPrevPrize()" next="$ctrl.setNextPrize()">\n</hot-keys>\n'), n.put("components/modal-account.html", '<div class="modal-header" id="modal-Account">\n\t<h4 class="modal-title">\n\t\t<translate>Account information</translate>\n\t</h4>\n\t\n\n\t<button type="button" class="close" ng-click="$ctrl.dismiss()">\n\t\t<i class="ion-close"></i>\n\t</button>\n</div>\n\n\n<div class="modal-body">\n\t<div class="modal-entry">\n\t\t<div class="modal-entry-head">\n\t\t\t<h6><translate>Account info</translate></h6>\n\t\t</div>\n\t\t\n\n\t\t<div class="modal-entry-body">\n\t\t\t<ul class="list-details">\n\t\t\t\t<li>\n\t\t\t\t\t<strong><translate>Email</translate>:</strong>\n\n\t\t\t\t\t<span>{{$ctrl.auth.email}}</span>\n\t\t\t\t</li>\n\n\t\t\t\t<li>\n\t\t\t\t\t<strong><translate>Your Name</translate>:</strong>\n\t\t\t\t\t<span ng-click="$ctrl.edit = true" ng-hide="$ctrl.edit || $ctrl.saving">{{$ctrl.auth.displayName}}</span>\n\t\t\t\t\t<a href="#" class="link-edit" ng-click="$ctrl.edit = true" ng-hide="$ctrl.edit || $ctrl.saving">\n\t\t\t\t\t\t<i class="ion-compose"></i>\n\t\t\t\t\t</a>\n\n\t\t\t\t\t<span class="ion-load-a rotation" ng-show="$ctrl.saving"></span>\n\t\t\t\t\t\n\t\t\t\t\t<form class="form-change-account-info" ng-if="$ctrl.edit && !$ctrl.saving" ng-submit="$ctrl.updateProfile()">\n\t\t\t\t\t\t<div class="input-group">\n\t\t\t\t\t\t\t<input type="text" autofocus class="field" id="user-company" ng-init="$ctrl.ux.focus(\'#user-company\')" ng-blur="$ctrl.updateProfile()" ng-value="$ctrl.auth.displayName" ng-model="$ctrl.company" ng-change="$ctrl.datachanged = true">\n\t\t\t\t\t\t\t<div class="input-group-btn">\n\t\t\t\t                <button type="submit" class="btn btn-primary"><span class="ion ion-ios-checkmark-empty"></span></button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</form>\n\t\t\t\t</li>\n\n\t\t\t\t<li>\n\t\t\t\t\t<strong><translate>Account Type</translate>:</strong> <translate>{{$ctrl.user.status()}}</translate>\n\t\t\t\t\t<a class="link-extent" ng-click="$ctrl.modals.open(\'Payment\')">\n\t\t\t\t\t\t<span ng-switch on="$ctrl.user.status()">\n\t\t\t\t\t\t\t<span ng-switch-when="Free Account"><translate>Pay to Upgrade</translate></span>\n\t\t\t\t\t\t\t<span ng-switch-when="Paid Account"><translate>Pay to Extend</translate></span>\n\t\t\t\t\t\t\t<span ng-switch-when="Expired Account"><translate>Pay to Extend</translate></span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\n\t\t\t\t<li ng-if="$ctrl.member.lastPayment">\n\t\t\t\t\t<strong><translate>Last Payment</translate>:</strong> {{$ctrl.member.lastPayment | amDateFormat: (\'DateTimeFormat\' | translate)}}\n\n\t\t\t\t</li>\n\n\t\t\t\t<li ng-if="$ctrl.member.expiration">\n\t\t\t\t\t<strong><translate>Expiration Date</translate>:</strong> {{$ctrl.member.expiration | amDateFormat: (\'DateTimeFormat\' | translate)}}\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t\n\t\t</div>\n\t\t\n\t</div>\n\t\n\n\t<div class="modal-entry">\n\t\t<div class="modal-entry-head">\n\t\t\t<h6><translate>Change Password</translate><span style="float:right">Build {{$ctrl.version}}</span></h6>\n\t\t</div>\n\t\t\n\n\t\t<div class="modal-entry-body">\n\t\t\t<div class="form-change-password">\n\t\t\t\t<form ng-submit="$ctrl.updatePassword()">\n\t\t      <fieldset ng-disabled="$ctrl.loading">\n\t\t\t\t\t\t<div class="form-body">\n\t\t\t\t\t\t\t<div class="form-row">\n\t\t\t\t\t\t\t\t<label for="field-new-password" class="form-label"><translate>Current password</translate></label>\n\n\t\t\t\t\t\t\t\t<input type="password" class="field" name="field-password" id="field-password" value="" placeholder="******" required ng-model="$ctrl.password">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\n\n\t\t\t\t\t\t\t<div class="form-row">\n\t\t\t\t\t\t\t\t<label for="field-new-password" class="form-label"><translate>New password</translate></label>\n\n\t\t\t\t\t\t\t\t<input type="password" class="field" name="field-new-password" id="field-new-password" value="" placeholder="******" required ng-model="$ctrl.newPassword">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\n\n\t\t\t\t\t\t\t<div class="form-row">\n\t\t\t\t\t\t\t\t<label for="field-re-enter" class="form-label"><translate>Re-enter</translate></label>\n\n\t\t\t\t\t\t\t\t<input type="password" class="field" name="field-re-enter" id="field-re-enter" value="" placeholder="******" required ng-model="$ctrl.rePassword">\n\n\t\t\t\t\t\t\t\t<p class="form-success">{{$ctrl.success}}</p>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<p class="form-error">{{$ctrl.error}}</p>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\n\n\t\t\t\t\t\t<div class="form-actions">\n\t\t\t\t\t\t\t<button type="submit" class="btn-alt btn-yellow-alt form-btn">\n\t\t\t\t\t\t\t\t<translate ng-hide="$ctrl.loading">Change password</translate>\n\t\t            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\n\t\t\t\t\t</fieldset>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t\t\n\t\t</div>\n\t\t\n\t</div>\n\t\n</div>\n\n'), n.put("components/modal-alert.html", '<div class="modal-header" id="modal-Alert">\n  <h4 class="modal-title">\n    <i class="ion-alert"></i>\n    {{($ctrl.resolve.title || \'Info\') | translate}}\n\t</h4>\n  \n\n  <button type="button" class="close" ng-if="$ctrl.dismissCountDown !== null">\n    {{$ctrl.dismissCountDown}}\n  </button>\n  <button type="button" class="close" ng-click="$ctrl.dismiss()" ng-if="$ctrl.dismissCountDown === null">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body alert-message">\n  {{$ctrl.resolve.message | translate}}\n</div>\n\n'), n.put("components/modal-background.html", '<div class="modal-header" id="modal-Background">\n  <h4 class="modal-title">\n\t\t\t<i class="ion-image"></i>\n      <translate>Change Background</translate>\n\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <ul class="list-backgrounds">\n    <li>\n      <div>\n        <img ng-if="$ctrl.info.background" ng-src="{{$ctrl.info.background}}">\n      </div>\n      <div class="tools">\n        <a ng-if="!$ctrl.user.authenticated" ng-click="$ctrl.modals.isAuthenticated(\'login\', \'Background\')">\n          <span class="ion-plus"></span>\n          <span><translate>Upload New Background</translate></span>\n        </a>\n        <a ng-if="$ctrl.user.authenticated && !$ctrl.editing.infobackground" ngf-select="$ctrl.uploadBackground($file)" ngf-accept="\'image/*\'" ngf-pattern="\'image/*\'" ngf-resize="{width: 3100}">\n          <span class="ion-plus"></span>\n          <span><translate>Upload New Background</translate></span>\n        </a>\n        <a href="#" ng-if="$ctrl.editing.infobackground">\n          <span class="ion-load-a rotation"></span>\n          <span><translate>Uploading...</translate></span>\n          <span>{{$ctrl.uploadProgress}}%</span>\n        </a>\n        <a ng-if="$ctrl.info.background && !$ctrl.editing.infobackground" ng-click="$ctrl.removeBackground()">\n          <span class="ion-minus"></span>\n          <span><translate>Remove Background</translate></span>\n        </a>\n      </div>\n    </li>\n  </ul>\n  \n</div>\n\n'), n.put("components/modal-button.html", '<div class="modal-header" id="modal-Button">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>Customize Button</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <div class="form-edit-text">\n    <form ng-submit="$ctrl.save()">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="form-body">\n          <div class="form-row">\n            <label for="field-text1" class="form-label"><translate>Spin</translate></label>\n\n            <input type="text" autofocus class="field" name="field-text1" id="field-text1" ng-attr-placeholder="{{\'Spin\' | translate}}" ng-model="$ctrl.buttons.spin" ng-change="$ctrl.datachanged = true">\n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-text2" class="form-label"><translate>Stop</translate></label>\n\n            <input type="text" class="field" name="field-text2" id="field-text2" ng-attr-placeholder="{{\'Stop\' | translate}}" ng-model="$ctrl.buttons.stop" ng-change="$ctrl.datachanged = true">\n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-text2" class="form-label"><translate>Confirm</translate></label>\n\n            <input type="text" class="field" name="field-text2" id="field-text3" ng-attr-placeholder="{{\'Confirm\' | translate}}" ng-model="$ctrl.buttons.confirm" ng-change="$ctrl.datachanged = true">\n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-text2" class="form-label"><translate>Retry</translate></label>\n\n            <input type="text" class="field" name="field-text2" id="field-text4" ng-attr-placeholder="{{\'Retry\' | translate}}" ng-model="$ctrl.buttons.retry" ng-change="$ctrl.datachanged = true">\n          </div>\n          \n        </div>\n        \n\n        <div class="form-actions">\n          <button type="button" class="btn-alt btn-grey" ng-click="$ctrl.reset()"><translate>Reset Default</translate></button>\n\n          <button type="button" class="btn-alt btn-grey" ng-click="$ctrl.dismiss()"><translate>Cancel</translate></button>\n\n          <button type="submit" class="btn-alt btn-yellow-alt form-btn">\n            <translate ng-hide="$ctrl.loading">Save</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n      </fieldset>\n    </form>\n  </div>\n  \n</div>\n\n'), n.put("components/modal-contact.html", '<div class="modal-header" id="modal-Contact">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>Contact us</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <div class="form-login-register form-contact">\n    <form ng-submit="$ctrl.submit()">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="form-body">\n          <div class="form-row">\n            <label for="field-name" class="form-label"><translate>Contact Name</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-person"></i>\n\n              <input type="text" autofocus class="field" name="field-name" id="field-name" value="" ng-model="$ctrl.data.contact_name" required>\n            </div>\n            \n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-email" class="form-label"><translate>Email</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-email"></i>\n\n              <input type="email" class="field" name="field-email" id="field-email" value="" ng-model="$ctrl.data.contact_email" required>\n            </div>\n            \n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-inquiry" class="form-label form-label-top"><translate>Inquiry</translate></label>\n\n            <div class="form-controls">\n              <textarea class="textarea" name="field-inquiry" id="field-inquiry" ng-model="$ctrl.data.contact_message" required></textarea>\n            </div>\n            \n          </div>\n          \n        </div>\n        \n\n        <div class="form-actions">\n          <button type="submit" class="btn btn-yellow form-btn">\n            <translate ng-hide="$ctrl.loading">Submit</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n\n      </fieldset>\n    </form>\n  </div>\n  \n</div>\n\n'), n.put("components/modal-forgot-password.html", '<div class="modal-header" id="modal-ForgotPassword">\n  <h4 class="modal-title">\n\t\t<i class="ion-android-person"></i>\n\t\t<translate>Reset Password</translate>\n\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss(\'\')">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n<div class="modal-body">\n  <div class="form-login-register form-login">\n    <form ng-submit="$ctrl.forgotPassword()">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="form-body">\n          <div class="form-row">\n            <p><translate>Enter your registered email</translate></p>\n          </div>\n          <div class="form-row">\n            <label for="field-email" class="form-label"><translate>Email</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-email"></i>\n\n              <input type="text" autofocus class="field" name="field-email" id="field-email" value="" placeholder="{{\'abcd@gmail.com\' | translate}}" autocomplete="off" required ng-model="$ctrl.email">\n            </div>\n            \n            <p class="form-error">{{$ctrl.error}}</p>\n          </div>\n          \n        </div>\n        \n\n        <div class="form-actions">\n          <button type="submit" class="btn btn-yellow form-btn">\n            <translate ng-hide="$ctrl.loading">Send email</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n      </fieldset>\n    </form>\n  </div>\n  \n\n  <a ui-sref="register" class="link-return" ng-click="$ctrl.analytics.log(\'ui_action\', \'Execute\', \'Link - Register\')">\n    <i class="ion-arrow-right-b"></i>\n    <span>\n      <translate>Return to Login form</translate>.\n\t\t</span>\n  </a>\n</div>\n\n'), n.put("components/modal-id.html", '<div class="modal-header" id="modal-Id">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>{{$ctrl.ids.length ? \'Edit ID\' : \'Update IDs for Presentation\'}}</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n\t\t\t\t\t\t<i class="ion-close"></i>\n\t\t\t\t\t</button>\n</div>\n\n\n<div class="modal-body">\n  <div class="form-edit">\n    <form ng-submit="$ctrl.save(0)">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="form-head">\n          <img src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/numbers.svg" alt="" width="32" height="15">\n\n          <strong><translate>Your Drawing IDs</translate></strong>\n\n          \n        </div>\n        \n\n        <div class="form-body">\n          <div class="form-row">\n            <div class="id-generator">\n              <label for="field-generate-id" class="form-label"><translate>Or Auto Generate ID</translate>:</label>\n\n              <input type="text" class="field" name="field-generate-id" id="field-generate-id" ng-value="{{$ctrl.start}}" ng-model="$ctrl.start">\n\n              <span class="divider">-</span>\n\n              <input type="text" class="field" name="field-generate-id-2" id="field-generate-id-2" value="{{$ctrl.end}}" ng-model="$ctrl.end">\n\n              <button type="button" class="btn-alt btn-yellow-alt" ng-click="$ctrl.generate($ctrl.start, $ctrl.end)"><translate>Generate</translate></button>\n            </div>\n            \n          </div>\n          \n\n          <div class="form-row">\n            <div class="form-col form-col-1of2">\n              <textarea class="textarea" autofocus name="field-text-id" id="field-text-id" ng-attr-placeholder="{{\'IDs ( 0-9, A-Z, maximum 16 characters )\' | translate}}" ng-model="$ctrl.ids" ng-list="&#10;" ng-trim="false" ng-change="$ctrl.datachanged = true"></textarea>\n            </div>\n            \n\n            <div class="form-col form-col-1of2">\n              <textarea class="textarea" name="field-text-id" id="field-text-names" ng-attr-placeholder="{{\'Name List\' | translate}}" ng-model="$ctrl.names" ng-list="&#10;" ng-trim="false" ng-change="$ctrl.datachanged = true"></textarea>\n            </div>\n            \n          </div>\n          <p ng-show="$ctrl.maxLength" class="text-danger"><translate>ID max length exceeds</translate></p>\n          \n          <div class="form-row">\n            <div class="form-notice">\n              <h6><translate>Total</translate>: {{$ctrl.ids.length || 0}} <translate>IDs</translate>, {{$ctrl.names.length || 0}} <translate>Names</translate></h6>\n\n              <p><translate>ID/Name pairs will be automatically matched line by line</translate></p>\n            </div>\n            \n          </div>\n          \n        </div>\n        \n\n        <div class="form-actions">\n          <button type="button" class="btn-alt btn-grey" ng-click="$ctrl.dismiss()"><translate>Cancel</translate></button>\n\n          <button type="submit" class="btn-alt btn-yellow-alt form-btn">\n            <translate ng-hide="$ctrl.loading">Save</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n\n          <button type="button" class="btn-alt btn-primary no-shadow form-btn" ng-click="$ctrl.save(1)">\n            <translate ng-hide="$ctrl.loading">Draw Now</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n      </fieldset>\n    </form>\n  </div>\n  \n</div>\n\n'), n.put("components/modal-ids-result.html", '<div class="modal-header" id="modal-IdResult">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>ID Drawing Winner</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <uib-tabset active="$ctrl.defaultTab" class="tabs tabs-result">\n    <uib-tab ng-repeat="prize in $ctrl.prizes" index="$index" heading="{{$ctrl.custom_prizes[prize.key] || (prize.name | translate)}}">\n      <div class="tab-pane-inner">\n        <div ng-if="!$ctrl.results.length && !$ctrl.resultsLoaded" class="left50 top40"><span class="ion-load-a rotation"></span></div>\n        <ol class="sessions">\n          <li class="session" ng-repeat="session in $ctrl.results | orderBy: \'$index\' : true" ng-if="session[prize.key]">\n            <h5 class="session-title">\n              <translate>Drawing Session</translate> {{$ctrl.results.length - $index}} &middot; \n              <a ng-if="$ctrl.state === \'customize\'" ng-click="$ctrl.toggleDel[session.$id + prize.key] = true"><span class="ion-ios-trash"></span></a>\n              <span class="toggleDel" ng-show="$ctrl.toggleDel[session.$id + prize.key]">\n                  <translate>This will delete all prizes in session</translate> {{$ctrl.results.length - $index}}!\n                  <a ng-click="$ctrl.deleteResult(session, prize)"><translate>Confirm</translate></a>\n                  <translate>or</translate>\n                  <a ng-click="$ctrl.toggleDel[session.$id + prize.key] = false"><translate>Cancel</translate></a>?\n              </span>\n            </h5>\n            \n\n            <table class="table table-results">\n              <thead>\n                <tr>\n                  <th><translate>#</translate></th>\n                  <th><translate>ID</translate></th>\n                  <th><translate>Winner Name</translate></th>\n                </tr>\n              </thead>\n\n              <tbody>\n                <tr ng-repeat="result in session[prize.key] | toArray | orderBy: \'-time\'" ng-class="$ctrl.rowStyle(prize.key, $index, result.status)">\n                  <td class="stt">{{$ctrl.getIndex(session[prize.key], session.$id, prize.key, $index)}}</td>\n                  <td class="resid">{{result.id}}</td>\n                  <td>{{result.name}}</td>\n                </tr>\n                <tr ng-if="!session[prize.key]">\n                  <td colspan="3"><translate>No result</translate></td>\n                </tr>\n              </tbody>\n            </table>\n          </li>\n          \n        </ol>\n        \n      </div>\n      \n    </uib-tab>\n  </uib-tabset>\n\n  <a class="link-download" ng-click="$ctrl.download()" href="#">\n    <i class="ion-android-download"></i>\n    <strong><translate>Download Results</translate></strong>\n  </a>\n</div>\n\n'),
        n.put("components/modal-intro.html", '<div class="modal-header" id="modal-Intro">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>Introduction</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <div class="modal-body">\n    <uib-tabset active="0" vertical="true" class="tabs tabs-intro">\n      <uib-tab index="0" heading="{{\'About Us\' | translate}}">\n        <div class="tab-pane-inner" ng-include="\'templates/tab-about.html\' | translate"></div>\n      </uib-tab>\n      <uib-tab index="1" heading="{{\'FAQ\' | translate}}">\n        <div class="tab-pane-inner" ng-include="\'templates/tab-faq.html\' | translate"></div>\n      </uib-tab>\n      <uib-tab index="2" heading="{{\'Term of Service\' | translate}}">\n        <div class="tab-pane-inner" ng-include="\'templates/tab-term.html\' | translate"></div>\n      </uib-tab>\n      <uib-tab index="3" heading="{{\'Privacy Policy\' | translate}}">\n        <div class="tab-pane-inner" ng-include="\'templates/tab-policy.html\' | translate"></div>\n      </uib-tab>\n      <uib-tab index="4" heading="{{\'Contact and Support\' | translate}}" select="$ctrl.modals.open(\'Contact\')">\n        <div class="tab-pane-inner" ng-include="\'templates/tab-contact.html\' | translate"></div>\n      </uib-tab>\n    </uib-tabset>\n  </div>\n</div>\n\n'), n.put("components/modal-language.html", '<div class="modal-header" id="modal-Language">\n  <h4 class="modal-title">\n\t\t\t<i class="ion-android-globe"></i>\n      <translate>Change language</translate>\n\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <ul class="list-languages">\n    <li ng-repeat="(key, language) in $ctrl.languages" ng-class="{current: $ctrl.language == key}">\n      <a href="" ng-click="$ctrl.changeLanguage(key)">\n        <img ng-src="{{language.flag}}">\n        <span>{{language.name}}</span>\n      </a>\n    </li>\n  </ul>\n  \n</div>\n\n'), n.put("components/modal-login.html", '<div class="modal-header" id="modal-Login">\n  <h4 class="modal-title">\n\t\t<i class="ion-android-person"></i>\n\t\t<translate>Login to continue</translate>\n\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss(\'\')">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n<div class="modal-body">\n  <div class="form-login-register form-login">\n    <form ng-submit="$ctrl.login()">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="form-body">\n          <div class="form-row">\n            <label for="field-email" class="form-label"><translate>Email</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-email"></i>\n\n              <input type="text" class="field" name="field-email" id="field-email" value="" ng-attr-placeholder="{{\'abcd@gmail.com\' | translate}}" autocomplete="off" required autofocus ng-model="$ctrl.email">\n            </div>\n            \n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-password" class="form-label"><translate>Password</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-android-lock"></i>\n\n              <input type="password" class="field field-password" name="field-password" id="field-password" value="" placeholder="*******" autocomplete="off" required ng-model="$ctrl.password">\n\n              <span class="form-hint">\n  \t\t\t\t\t\t\t\t\t\t\t<a ui-sref="forgotPassword" ng-click="$ctrl.analytics.log(\'ui_action\', \'Execute\', \'Link - Forgot Password\')"><translate>Forgot password</translate>?</a>\n  \t\t\t\t\t\t\t\t\t\t</span>\n            </div>\n            \n\n            <p class="form-error">{{$ctrl.error}}</p>\n          </div>\n          \n        </div>\n        \n\n        <div class="form-actions">\n          <button type="submit" class="btn btn-yellow form-btn">\n            <translate ng-hide="$ctrl.loading">Login</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n      </fieldset>\n    </form>\n  </div>\n  \n\n  <a ui-sref="register" class="link-return" ng-click="$ctrl.analytics.log(\'ui_action\', \'Execute\', \'Link - Register\')">\n    <i class="ion-arrow-right-b"></i>\n    <span>\n\t\t\t<translate>Don\'t have an account?</translate> <strong><translate>Register</translate>.</strong>\n\t\t</span>\n  </a>\n</div>\n\n'), n.put("components/modal-message.html", '<div class="modal-header" id="modal-Message">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>Customize Action Message</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <div class="form-edit-text">\n    <form ng-submit="$ctrl.save()">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="form-body">\n          <div class="form-row">\n            <label for="field-text1" class="form-label"><translate>Press the Spin button to start</translate></label>\n\n            <input type="text" autofocus class="field" name="field-text1" id="field-text1" ng-attr-placeholder="{{\'Press the Spin button to start\' | translate}}" ng-model="$ctrl.messages.start" ng-change="$ctrl.datachanged = true">\n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-text2" class="form-label"><translate>Winner is coming...</translate></label>\n\n            <input type="text" class="field" name="field-text2" id="field-text2" ng-attr-placeholder="{{\'Winner is coming...\' | translate}}" ng-model="$ctrl.messages.wait" ng-change="$ctrl.datachanged = true">\n          </div>\n          \n        </div>\n        \n\n        <div class="form-actions">\n          <button type="button" class="btn-alt btn-grey" ng-click="$ctrl.reset()"><translate>Reset Default</translate></button>\n\n          <button type="button" class="btn-alt btn-grey" ng-click="$ctrl.dismiss()"><translate>Cancel</translate></button>\n\n          <button type="submit" class="btn-alt btn-yellow-alt form-btn">\n            <translate ng-hide="$ctrl.loading">Save</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n      </fieldset>\n    </form>\n  </div>\n  \n</div>\n\n'), n.put("components/modal-notify.html", '<div class="modal-header" id="modal-Notify">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>Payment Complete</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n\t\t\t\t\t\t<i class="ion-close"></i>\n\t\t\t\t\t</button>\n</div>\n\n\n<div class="modal-body">\n  <div class="subscription subscription-complete">\n    <h6><translate>Payment completed successfully</translate></h6>\n\n    <img src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/diamond.svg" height="55" width="65" alt="">\n\n    <p>\n      <translate>Your subscription</translate>: <strong>{{$ctrl.notification.$value  | amDateFormat:(\'DateTimeFormat\' | translate)}}</strong> <br>\n      <translate>Thanks for being awesome with Lucky Draw</translate> <br>\n      <translate>Now you’ll return to edit your custom Photos/ IDs</translate> <br>\n    </p>\n\n    <a class="btn-alt btn-orange" ng-click="$ctrl.close()">Ok</a>\n  </div>\n  \n</div>\n\n'), n.put("components/modal-payment.html", '<div class="modal-header" id="modal-Payment">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<span ng-switch on="$ctrl.user.status()">\n\t\t\t\t\t\t\t<span ng-switch-when="Free Account"><translate>Pay to Upgrade</translate></span>\n\t\t\t\t\t\t\t<span ng-switch-when="Paid Account"><translate>Pay to Extend</translate></span>\n\t\t\t\t\t\t\t<span ng-switch-when="Expired Account"><translate>Pay to Extend</translate></span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-if="$ctrl.dismissCountDown !== null">\n\t\t\t\t\t{{$ctrl.dismissCountDown}}\n\t\t\t\t\t</button>\n\t<button type="button" class="close" ng-if="$ctrl.dismissCountDown === null" ng-click="$ctrl.dismiss()">\n\t\t\t\t\t<i class="ion-close"></i>\n\t\t\t\t\t</button>\n</div>\n\n\n<div class="modal-body">\n  <div class="form-edit" id="payment-form"><span class="ion-load-a rotation"></span></div>\n  \n</div>\n\n'), n.put("components/modal-prize.html", '<div class="modal-header" id="modal-Prize">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<translate>Customize name of Prizes</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.doDismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <div class="form-customize-prizes">\n    <form ng-submit="$ctrl.save()" ng-init="$ctrl.ux.focus(\'#field-x-prize\')">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="explain">\n          <small><translate>Select Checkbox to Enable Prize</translate></small>\n        </div>\n        <div class="form-body prize-rows">\n\n          <div class="form-row" ng-repeat="p in $ctrl.allPrizes" index="$index">\n            <label for="check-{{p.key}}-prize" class="form-label">{{p.name | translate}}</label>\n\n            <input type="checkbox" name="check-{{p.key}}-prize" id="check-{{p.key}}-prize" ng-model="$ctrl.enabled_prizes[p.key]" ng-change="$ctrl.namechanged = true">\n            <input type="text" class="field" name="field-{{p.key}}-prize" id="field-{{p.key}}-prize" ng-attr-placeholder="{{$index > 4 ? \'\' : (p.name | translate)}}" ng-model="$ctrl.prizes[p.key]" ng-change="$ctrl.namechanged = true">\n\n            <span ng-if="$ctrl.editing[\'icons\'+p.key]"><i class="ion-load-a rotation"></i></span>\n            <a ng-if="!$ctrl.setting.icons[p.key] && !$ctrl.editing[\'icons\'+p.key]" href="#" ngf-select="$ctrl.uploadIcon($file, p.key)" ngf-accept="\'image/*\'" ngf-pattern="\'image/*\'" ngf-resize="{height: 200}" class="custom-prize-icons">\n              <img ng-src="{{p.image}}" ng-class="$index == 0 ? \'att-prizeicons\' : \'\'">\n              <span class="ion-upload"></span>\n            </a>\n            <a ng-if="$ctrl.setting.icons[p.key] && !$ctrl.editing[\'icons\'+p.key]" href="#" ng-click="$ctrl.removeIcon(p.key)" class="custom-prize-icons">\n              <img ng-src="{{$ctrl.setting.icons[p.key]}}">\n              <span class="ion-trash-a"></span>\n            </a>\n          </div>\n          \n\n        </div>\n        \n\n        <div class="form-actions">\n          <button type="button" class="btn-alt btn-grey" ng-click="$ctrl.reset()"><translate>Reset Default</translate></button>\n\n          <button type="button" class="btn-alt btn-grey" ng-click="$ctrl.doDismiss()"><translate>Cancel</translate></button>\n\n          <button type="submit" class="btn-alt btn-yellow-alt form-btn">\n            <translate ng-hide="$ctrl.loading">Save</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n      </fieldset>\n    </form>\n  </div>\n  \n</div>\n\n'), n.put("components/modal-register.html", '<div class="modal-header" id="modal-Register">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<i class="ion-android-person"></i>\n\n\t\t\t\t\t\t<translate>Register</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <div class="form-login-register">\n    <form ng-submit="$ctrl.register()">\n      <fieldset ng-disabled="$ctrl.loading">\n        <div class="form-body">\n          <div class="form-row">\n            <p><translate>You can create your own lucky drawing list after registration</translate></p>\n          </div>\n          <div class="form-row">\n            <label for="field-company" class="form-label"><translate>Your Name</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-person"></i>\n\n              <input type="text" class="field" name="field-company" id="field-company" value="" ng-attr-placeholder="{{\'ABC Company\' | translate}}" autocomplete="off" required autofocus ng-model="$ctrl.company">\n            </div>\n            \n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-email" class="form-label"><translate>Email</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-email"></i>\n\n              <input type="text" class="field" name="field-email" id="field-email" value="" ng-attr-placeholder="{{\'abcd@gmail.com\' | translate}}" required ng-model="$ctrl.email" autocomplete="off">\n            </div>\n            \n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-phone" class="form-label"><translate>Phone</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-android-phone-portrait"></i>\n\n              <input type="text" class="field" name="field-phone" id="field-phone" value="" ng-attr-placeholder="0123456789" required ng-model="$ctrl.phone" autocomplete="off">\n            </div>\n            \n          </div>\n          \n\n          <div class="form-row">\n            <label for="field-password" class="form-label"><translate>Password</translate></label>\n\n            <div class="form-controls">\n              <i class="ion-android-lock"></i>\n\n              <input type="password" class="field field-password" name="field-password" id="field-password" value="" placeholder="*******" autocomplete="off" required ng-model="$ctrl.password">\n\n            </div>\n            \n\n            <div class="checkbox">\n              <input type="checkbox" name="field-updates" id="field-updates" ng-model="$ctrl.newsletter">\n              <label class="form-label" for="field-updates">\n                {{\'Send me LuckyDraw newsletters\' | translate}}\n              </label>\n            </div>\n            \n            <p class="form-error">{{$ctrl.error}}</p>\n          </div>\n          \n        </div>\n        \n\n        <div class="form-actions">\n          <button type="submit" class="btn btn-yellow form-btn">\n            <translate ng-hide="$ctrl.loading">Register</translate>\n            <span class="ion-load-a rotation" ng-show="$ctrl.loading"></span>\n          </button>\n        </div>\n        \n      </fieldset>\n    </form>\n  </div>\n  \n\n  <a ui-sref="login" class="link-return" ng-click="$ctrl.analytics.log(\'ui_action\', \'Execute\', \'Link - Login\')">\n    <i class="ion-arrow-right-b"></i>\n    <span>\n\t\t\t\t\t\t\t<translate>Already have an account?</translate> <strong><translate>Login</translate>.</strong>\n\t\t\t\t\t\t</span>\n  </a>\n</div>\n\n'), n.put("components/modal-survey.html", '<div class="modal-header" id="modal-Login">\n  <h4 class="modal-title">\n\t\t<translate>Hi there, what are you doing with quayso.xemayvinhtruong.vn?</translate>\n\t</h4>\n  \n\n  \n</div>\n\n<div class="modal-body">\n  <div class="form-login-register form-login">\n    <div>\n        <i class="ion-ios-list"></i>\n        <a ng-click="$ctrl.select(\'Planning Event\')"><translate>I\'m planning a lucky draw event</translate></a>\n        <hr>\n    </div>\n    <div>\n        <i class="ion-social-usd"></i>\n        <a ng-click="$ctrl.select(\'Play Game\')"><translate>I want to play online lucky draw</translate></a>\n        <hr>\n    </div>\n    <div>\n        <i class="ion-calculator"></i>\n        <a ng-click="$ctrl.select(\'Random Number\')"><translate>I need some random numbers</translate></a>\n    </div>\n  </div>\n  \n</div>\n\n'), n.put("components/modal-theme.html", '<div class="modal-header" id="modal-Theme">\n  <h4 class="modal-title">\n\t\t\t\t\t\t<i class="ion-android-color-palette"></i>\n\t\t\t\t\t\t<translate>Change theme</translate>\n\t\t\t\t\t</h4>\n  \n\n  <button type="button" class="close" ng-click="$ctrl.dismiss()">\n    <i class="ion-close"></i>\n  </button>\n</div>\n\n\n<div class="modal-body">\n  <h6><translate>Select a color theme that match your brand or event</translate></h6>\n\n  <ul class="theme-previews">\n    <li class="theme-preview theme-preview-purple" ng-repeat="(theme, name) in $ctrl.themes" ng-class="\'theme-preview-\' + theme + ($ctrl.theme == theme ? \' current\' : \'\')">\n      <a href="" ng-click="$ctrl.changeTheme(theme)">\n        <div class="theme-preview-inner">\n          <i class="ion-checkmark-circled"></i>\n        </div>\n        \n\n        <h6 class="theme-preview-title">{{name | translate}}</h6>\n        \n      </a>\n    </li>\n  </ul>\n  \n  <div class="cleafix"></div>\n</div>\n\n'), n.put("templates/main.html", '<id-lucky-draw data="$ctrl.data" setting="$ctrl.setting" results="$ctrl.results" is-limited="$ctrl.isLimited(r)"></id-lucky-draw>\n'), n.put("templates/mod.html", '<header class="header" ng-if="!$ctrl.lockUI">\n  <div class="container-fluid">\n    <div class="row">\n      \n      <div class="logo-zone hidden">\n        <a ng-if="!$ctrl.user.editing.infologo && !$ctrl.setting.info.logo" class="logo default-logo" ngf-select="$ctrl.uploadLogo($file)" ngf-accept="\'image/*\'" ngf-pattern="\'image/*\'" ngf-resize="{height: 200}">\n          <span ng-class="$ctrl.ux.cssIntro.infologo"><translate>Logo</translate></span>\n        </a>\n        <a ng-if="!$ctrl.user.editing.infologo && $ctrl.setting.info.logo" class="logo" ng-click="$ctrl.removeLogo()">\n          <img class="light-on" ng-src="{{$ctrl.setting.info.logo}}">\n        </a>\n        <a ng-if="$ctrl.user.editing.infologo" class="logo default-logo">\n          <span class="ion-load-a rotation"></span>\n        <a>\n      </a></a></div>\n      \n\n      <div class="col-xs-12">\n        \n        <h1>\n          <a ng-click="$ctrl.user.editing.infoname = true" ng-if="!$ctrl.user.editing.infoname">\n            <span class="event-name" ng-style="{\'color\': $ctrl.setting.colors.name}">\n              {{$ctrl.setting.info.name || ($ctrl.defaultSetting.info.name | translate)}}\n              <i class="btn-customize ion ion-compose" ng-class="$ctrl.ux.cssIntro.infoname"></i>\n            </span>\n          </a>\n          <span ng-if="!$ctrl.user.editing.infoname">\n            <color-picker class="btn-color-picker" ng-class="$ctrl.ux.cssIntro.colorsname" event-api="$ctrl.colorEvents" options="$ctrl.clpkopbr" ng-model="$ctrl.setting.colors.name">\n            </color-picker>\n          </span>\n          \n          <form ng-submit="$ctrl.saveSetting(\'infoname\')" class="form-inline" ng-if="$ctrl.user.editing.infoname">\n            <div class="input-group">\n              <input type="text" autofocus class="form-control" id="setting-infoname" ng-init="$ctrl.ux.focus(\'#setting-infoname\')" ng-blur="$ctrl.saveSetting(\'infoname\')" placeholder="{{\'Your Event Name\' | translate}}" value="{{$ctrl.setting.info.name}}" ng-model="$ctrl.setting.info.name" ng-change="$ctrl.changed.infoname = true">\n              <div class="input-group-btn">\n                <button type="submit" class="btn btn-primary"><span class="ion ion-ios-checkmark-empty"></span></button>\n              </div>\n            </div>\n          </form>\n\t\t\t\t</h1>\n        \n\n        <div class="header-content hidden">\n          \n          <a ng-click="$ctrl.user.editing.infocompany = true" ng-if="!$ctrl.user.editing.infocompany">\n            <span class="link-company" ng-style="$ctrl.ux.style($ctrl.setting.colors.action_msg, 1)">\n              {{$ctrl.setting.info.company || (\'...\' | translate)}}\n              <i class="btn-customize ion ion-compose" ng-class="$ctrl.ux.cssIntro.infocompany"></i>\n            </span>\n          </a>\n          \n          <form ng-submit="$ctrl.saveSetting(\'infocompany\')" class="form-inline" ng-if="$ctrl.user.editing.infocompany">\n            <div class="input-group">\n              <input type="text" autofocus class="form-control" id="setting-infocompany" ng-init="$ctrl.ux.focus(\'#setting-infocompany\')" ng-blur="$ctrl.saveSetting(\'infocompany\')" placeholder="{{\'Lucky Draw\' | translate}}" value="{{$ctrl.setting.info.company}}" ng-model="$ctrl.setting.info.company" ng-change="$ctrl.changed.infocompany = true">\n              <div class="input-group-btn">\n                <button type="submit" class="btn btn-primary"><span class="ion ion-ios-checkmark-empty"></span></button>\n              </div>\n            </div>\n          </form>\n          \n        </div>\n      </div>\n    </div>\n  </div>\n</header>\n\n<div class="main-padding" ng-if="!$ctrl.lockUI">\n  <div class="container-fluid">\n    <div class="row">\n      <div class="col-xs-12">\n        <section class="section section-prize">\n          <header class="section-head" ng-class="$ctrl.animClass.setprize">\n            \n            <div class="coin hidden">\n              <img class="prize-image" ng-repeat="prize in $ctrl.prizes" ng-src="{{prize.image}}" ng-show="$ctrl.prizeIndex == $index && prize.showimage">\n            </div>\n            \n          </header>\n\n          \n          <div class="ttkh"><span>Khách hàng:</span><input id="field-company" placeholder="Họ tên"/><span>Số điện thoại:</span><input id="field-phone" placeholder="Số điện thoại"/></div><div class="section-message">\n            <h2 ng-style="$ctrl.ux.style($ctrl.setting.colors.action_msg, 1)" ng-class="$ctrl.animClass.message">\n              <span class="winner-name">\n                <translate>Winner Name Here</translate>\n              </span>\n              <span>\n                <color-picker class="btn-color-picker" ng-class="$ctrl.ux.cssIntro.colorsaction_msg" event-api="$ctrl.colorEvents" options="$ctrl.clpkoptl" ng-model="$ctrl.setting.colors.action_msg">\n                </color-picker>\n              </span>\n            </h2>\n          </div>\n          \n\n          <div class="section-body hidden" ng-class="$ctrl.animClass.setprize">\n            <div class="section-body-inner section-body-inner-primary">\n              <ul class="slots">\n                \n                <a ng-click="$ctrl.modals.open(\'Id\')">\n                  <li class="slot" ng-repeat="n in $ctrl.machineSlots" index="$index" ng-class="\'slot-1of\'+$ctrl.slotsCss + \' state-\'+$ctrl.state">\n                    <div class="slot-item">\n                      <div class="slot-number">\n                        <span ng-class="$ctrl.state !== \'ready\' ? \'not-available\' : \'available\'"><i class="btn-customize ion ion-compose" ng-class="$index === 0 ? $ctrl.ux.cssIntro.dataids : \'\'"></i></span>\n                      </div>\n                    </div>\n                  </li>\n                </a>\n                \n              </ul>\n            </div>\n          </div>\n\n          <div class="section-actions">\n            <div class="section-head-actions hidden">\n              \n              <a class="link-prev" ng-class="$ctrl.state !== \'ready\' || $ctrl.prizeIndex <= 0 ? \'not-available\' : \'available\'" ng-click="$ctrl.setPrize($ctrl.prizeIndex - 1)">\n                <i class="ion-chevron-left"></i>\n              </a>\n              \n  \n              \n              <a ng-click="$ctrl.modals.open(\'Prize\')">\n                <span class="prize-text">\n                  {{$ctrl.setting.prizes[$ctrl.prize.key] || ($ctrl.defaultSetting.prizes[$ctrl.prize.key] | translate)}}\n                  <i class="btn-customize ion ion-compose" ng-class="$ctrl.ux.cssIntro.prizes"></i>\n                </span>\n              </a>\n              \n  \n              \n              \n  \n              \n              <a class="link-next" ng-class="$ctrl.state !== \'ready\' || $ctrl.prizeIndex >= $ctrl.prizes.length - 1 ? \'not-available\' : \'available\'" ng-click="$ctrl.setPrize($ctrl.prizeIndex + 1)">\n                <i class="ion-chevron-right"></i>\n              </a>\n              \n            </div>\n\n            <div class="section-button">\n              <div class="state-ready">\n                <a class="btn btn-yellow btn-yellow-secondary" ng-click="$ctrl.goPresentation()" ng-mouseover="$ctrl.ux.mOver(\'pres\')" ng-mouseleave="$ctrl.ux.mLeave(\'pres\')">\n                  <span class="keyboard-key pres-key" ng-if="$ctrl.ux.hint.pres"><span>F10</span></span>\n                  <translate>Presentation</translate>\n                </a>\n                <a ng-click="$ctrl.modals.open(\'Button\')">\n                  <i class="btn-customize yellow ion ion-compose" ng-class="$ctrl.ux.cssIntro.buttons"></i>\n                </a>\n              </div>\n            </div> \n\n          </div> \n        </section>\n      </div>\n    </div>\n  </div>\n</div> \n\n<app-footer light-off="false"></app-footer>\n\n<hot-keys enter="" nextstep="$ctrl.goPresentation()" confirm="" cancel="" prev="$ctrl.setPrevPrize()" next="$ctrl.setNextPrize()">\n</hot-keys>'), n.put("templates/presentation.html", '<id-lucky-draw ng-if="!$ctrl.lockUI" data="$ctrl.data" setting="$ctrl.setting" results="$ctrl.results" is-limited="$ctrl.isLimited(r)"></id-lucky-draw>\n'), n.put("templates/tab-about.html", '<ol class="tab-items">\n  <li class="tab-item">\n    <h6>What is XEMAYVINHTRUONG.VN?</h6>\n    <p>XEMAYVINHTRUONG.VN is the world\'s most sophisticated random number generator.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>What kind of events this Lucky Draw app is good for?</h6>\n    <p>It could be a marketing program, a sales event, a customer rewarding program, a year end party...</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Who are you guys?</h6>\n    <p>We\'re a team of entrepreneurs who want to build Internet products that make life easier.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Where are you based?</h6>\n    <ul>\n      <li>We\'re based in Hanoi, Vietnam.</li>\n      <li>Address: 8th Floor, 1st Luong Yen Street, Hanoi, Vietnam.</li>\n      <li>Contact number: +84 904-131-696</li>\n      <li>Email: chusunpro@gmail.com</li>\n    </ul>\n  </li>\n</ol>\n'), n.put("templates/tab-contact.html", '<ol class="tab-items">\n</ol>\n\n'), n.put("templates/tab-faq.html", '<ol class="tab-items">\n  <li class="tab-item">\n    <h6>What are keyboard shorcuts?</h6>\n    <ul>\n      <li><strong>ENTER</strong> to Start/Stop Spinning.</li>\n      <li><strong>PLUS key (+)</strong> to Confirm.</li>\n      <li><strong>MINUS key (-)</strong> to Reject.</li>\n      <li><strong>LEFT/RIGHT</strong> to switch between prizes.</li>\n    </ul>\n  </li>\n\n  <li class="tab-item">\n    <h6>Does XEMAYVINHTRUONG.VN work offline?</h6>\n    <p>You can disconnect from the Internet  right after switching to Presentation mode. XEMAYVINHTRUONG.VN will then work in offline mode. Drawing results will be synced to the server when you\'re connected later.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Can I customize the drawing interface?</h6>\n    <p>Everything is customizable. Just <a ng-click="$ctrl.modals.open(\'Register\')">register an account</a> and login to see how it well fit your demand.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>What are the lucky drawing rules?</h6>\n    <ul>\n      <li>Everytime you hit F5 to fully refresh your browser, a new drawing session is created.</li>\n      <li>Each ID only got lucky once in a drawing session. After an ID is selected for a prize, it will be excluded from the next drawing turns of the running session.</li>\n    </ul>\n  </li>\n\n  <li class="tab-item">\n    <h6>My ID list has numeric and alphabet characters. Will it work?</h6>\n    <p>Sure. An ID can have any kind of characters. Even !@#$%^* will work. And the max acceptable length for a single ID is 23 characters.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>What\'s the price?</h6>\n    <p>Please <a ng-click="$ctrl.modals.open(\'Payment\')">click here</a> to check the price (you will be asked to login).</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Can I request for refund?</h6>\n    <p>You can open an account and try everything within XEMAYVINHTRUONG.VN at no cost, no limitation. Except drawing results are not saved in the Presentation mode. We assume that you\'re fully sold once you decide to make your payment, so we offer no refund policy.</p>\n  </li>\n</ol>\n\n'), n.put("templates/tab-policy.html", '<ol class="tab-items">\n  <li class="tab-item">\n    <h6>Your data is your private property!</h6>\n    <p>The list of IDs/Names and Photos you upload to XEMAYVINHTRUONG.VN stays completely private to your own use. We have no usage right to your data.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>We use website tracking tools</h6>\n    <p>We use website tracking software to understand website traffic and usage pattern. This helps us improve the design and functionality of XEMAYVINHTRUONG.VN</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>We have cookies</h6>\n    <p>XEMAYVINHTRUONG.VN use cookie only to support your own use. It stores your application settings and drawing data that\'s needed for offline working.</p>\n  </li>\n</ol>\n'), n.put("templates/tab-term.html", '<ol class="tab-items">\n  <li class="tab-item">\n    <h6>Prohibited Uses</h6>\n    <p>Effective from December 1, 2016.</p>\n    <p>By accessing this website, you acknowledge and agree that you may use our site only for lawful purposes. You may not use our site for any unlawful purposes, including but not limited to:</p>\n    <ul>\n      <li>In any way that breaches any applicable local, national or international law or regulation;</li>\n      <li>In any way to send, knowingly receive, upload, download, use or re-use any data which does not comply with any applicable local, national or international law or regulation;</li>\n      <li>In any way that is unlawful or fraudulent, or has any unlawful or fraudulent purpose or effect;</li>\n      <li>In any way for the purpose of violance;</li>\n      <li>In any way that harm or attempting to harm any human or any living animal;</li>\n      <li>In any way that be likely to harass, upset, embarrass, alarm, annoy or deceive any other person;</li>\n      <li>In any way for the purpose of promoting illegal activity or discrimination based on race, sex, religion, nationality, disability, sexual orientation or age.</li>\n      <p>Failure to comply with this acceptable use policy will result in immediate withdrawal of your right to use our site. We may disclosure of such information to law enforcement authorities, and we may take further legal action against you as we reasonably feel is necessary.</p>\n    </ul>\n  </li>\n\n  <li class="tab-item">\n    <h6>Change to the acceptable use policy</h6>\n    <p>We may revise this acceptable use policy at any time by amending this page. By accessing this website, you are expected to check this page from time to time to take notice of any changes we make, as they are legally binding on you. Some of the provisions contained in this acceptable use policy may also be superseded by provisions or notices published elsewhere on our site.</p>\n  </li>\n</ol>\n'), n.put("templates/payment-form/payment-button.html", '            <button type="submit" class="btn-alt btn-orange">\n              <span ng-switch on="$ctrl.user.status()">\n                <span ng-switch-when="Free Account"><translate>Pay to Upgrade</translate></span>\n                <span ng-switch-when="Paid Account"><translate>Pay to Extend</translate></span>\n                <span ng-switch-when="Expired Account"><translate>Pay to Extend</translate></span>\n              </span>\n            </button>'), n.put("templates/payment-form/payment-intro.html", '            <p>\n              <span ng-if="$ctrl.appState.name !== \'presentation\'" ng-switch on="$ctrl.user.status()">\n                <span ng-switch-when="Free Account"><translate>Upgrade to Remove Your Account Limits</translate></span>\n                <span ng-switch-when="Paid Account"><translate>Pay to Extend Usage Time</translate></span>\n                <span ng-switch-when="Expired Account"><translate>Pay to Extend Usage Time</translate></span>\n              </span>\n              <span ng-if="$ctrl.appState.name === \'presentation\'" ng-switch on="$ctrl.user.status()">\n                <span ng-switch-when="Free Account"><translate>Upgrade to Continue Lucky Drawing</translate></span>\n                <span ng-switch-when="Paid Account"><translate>Pay to Extend Lucky Drawing Time</translate></span>\n                <span ng-switch-when="Expired Account"><translate>Pay to Extend Lucky Drawing Time</translate></span>\n              </span>\n            </p>\n\n            <img src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/diamond-icon.svg" height="55" width="65" alt="">\n\n            <h2 class="subscription-price"><translate>Service Price</translate></h2>\n\n            <h6>\n\t\t\t\t\t\t\t<translate>Usage Days</translate>\n              <br>\n              <em><translate>Service Price Guide</translate></em>\n\t\t\t\t\t\t</h6>'),
        n.put("templates/payment-form/paypal.html", '    <form ng-attr-action="{{$ctrl.paypal.action}}" method="post" target="_top" ng-submit="$ctrl.submit()">\n      \n      \n\n      <div class="form-body">\n        <div class="form-alert">\n          <div class="subscription">\n            \n            <p>\n              <span ng-if="$ctrl.appState.name !== \'presentation\'" ng-switch on="$ctrl.user.status()">\n                <span ng-switch-when="Free Account"><translate>Upgrade to Remove Your Account Limits</translate></span>\n                <span ng-switch-when="Paid Account"><translate>Pay to Extend Usage Time</translate></span>\n                <span ng-switch-when="Expired Account"><translate>Pay to Extend Usage Time</translate></span>\n              </span>\n              <span ng-if="$ctrl.appState.name === \'presentation\'" ng-switch on="$ctrl.user.status()">\n                <span ng-switch-when="Free Account"><translate>Upgrade to Continue Lucky Drawing</translate></span>\n                <span ng-switch-when="Paid Account"><translate>Pay to Extend Lucky Drawing Time</translate></span>\n                <span ng-switch-when="Expired Account"><translate>Pay to Extend Lucky Drawing Time</translate></span>\n              </span>\n            </p>\n\n            <img src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/diamond-icon.svg" height="55" width="65" alt="">\n\n            <h2 class="subscription-price">{{$ctrl.paypal.prices[$ctrl.package] | currency:"USD $"}}</h2>\n\n            <h6 style="display: none">\n              <label for="event1day" class="formradio">\n                <input type="radio" ng-model="$ctrl.package" id="event1day" value="event1day" selected="selected">\n                {{\'1 day event\' | translate}}\n              </label>\n            </h6>\n\n            <h6>\n              {{\'estimated usage time\' | translate}} \n              <span>{{$ctrl.timingStart | amDateFormat:(\'shortDateTimeFormat\' | translate)}}</span> \n              {{\'until\' | translate}} \n              <span>{{$ctrl.timingStart + ($ctrl.times[$ctrl.package] * 86400 * 1000) | amDateFormat:(\'shortDateTimeFormat\' | translate)}}</span>\n\t\t\t\t\t\t</h6>\n            \n\n            \n            <input type="hidden" name="cmd" value="_s-xclick">\n            <input type="hidden" name="hosted_button_id" ng-value="$ctrl.paypal.buttons[$ctrl.package]">\n            <img alt="" border="0" src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/pixel.gif" width="1" height="1">\n            \n            <input type="hidden" name="custom" ng-value="$ctrl.custom">\n            <input type="hidden" name="email" ng-value="$ctrl.email">\n            <button ng-if="$ctrl.userService.authenticated" type="submit" class="btn-alt btn-orange">\n                <translate>Pay Now</translate>\n            </button>\n            <button ng-if="!$ctrl.userService.authenticated" type="button" class="btn-alt btn-orange" ng-click="$ctrl.modals.isAuthenticated(\'register\', \'Payment\')">\n                <translate>Register Now</translate>\n            </button>\n\n            <br>\n\n            <img src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/cards.jpg" height="21" width="261" alt="">\n\n            <br><br>\n            <translate>Paypal Payment Guide</translate>\n\n          </div>\n          \n        </div>\n        \n      </div>\n      \n      \n      </form>\n'), n.put("templates/payment-form/soha.html", '    <form ng-submit="$ctrl.submit()">\n      \n      \n\n      <div class="form-body">\n        <div class="form-alert">\n          <div class="subscription">\n            \n            <p>\n              <span ng-if="$ctrl.appState.name !== \'presentation\'" ng-switch on="$ctrl.user.status()">\n                <span ng-switch-when="Free Account"><translate>Upgrade to Remove Your Account Limits</translate></span>\n                <span ng-switch-when="Paid Account"><translate>Pay to Extend Usage Time</translate></span>\n                <span ng-switch-when="Expired Account"><translate>Pay to Extend Usage Time</translate></span>\n              </span>\n              <span ng-if="$ctrl.appState.name === \'presentation\'" ng-switch on="$ctrl.user.status()">\n                <span ng-switch-when="Free Account"><translate>Upgrade to Continue Lucky Drawing</translate></span>\n                <span ng-switch-when="Paid Account"><translate>Pay to Extend Lucky Drawing Time</translate></span>\n                <span ng-switch-when="Expired Account"><translate>Pay to Extend Lucky Drawing Time</translate></span>\n              </span>\n            </p>\n\n            <img src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/diamond-icon.svg" height="55" width="65" alt="">\n\n            <h2 class="subscription-price">{{$ctrl.soha.prices[$ctrl.package] | currency:"":0}} đ</h2>\n\n            <h6 style="display: none">\n              <label for="event1day" class="formradio">\n                <input type="radio" ng-model="$ctrl.package" id="event1day" value="event1day" selected="selected">\n                {{\'1 day event\' | translate}}\n              </label>\n            </h6>\n\n            <h6>\n              {{\'estimated usage time\' | translate}} \n              <span>{{$ctrl.timingStart | amDateFormat:(\'shortDateTimeFormat\' | translate)}}</span> \n              {{\'until\' | translate}} \n              <span>{{$ctrl.timingStart + ($ctrl.times[$ctrl.package] * 86400 * 1000) | amDateFormat:(\'shortDateTimeFormat\' | translate)}}</span>\n\t\t\t\t\t\t</h6>\n            \n\n            <button ng-if="$ctrl.userService.authenticated" type="submit" class="btn-alt btn-orange">\n                <translate>Pay Now</translate>\n            </button>\n            <button ng-if="!$ctrl.userService.authenticated" type="button" class="btn-alt btn-orange" ng-click="$ctrl.modals.isAuthenticated(\'register\', \'Payment\')">\n                <translate>Register Now</translate>\n            </button>\n\n            <br>\n\n            <img src="//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/cards.jpg" height="21" width="261" alt="">\n\n            <br><br>\n            {{$ctrl.paymentGuide | translate}}\n\n          </div>\n          \n        </div>\n        \n      </div>\n      \n      \n      </form>\n'), n.put("templates/vi/tab-about.html", '<ol class="tab-items">\n  <li class="tab-item">\n    <h6>XEMAYVINHTRUONG.VN là gì?</h6>\n    <p>XEMAYVINHTRUONG.VN là dịch vụ thuê bao phần mềm Quay số trúng thưởng.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Có thể sử dụng phần mềm LuckyDraw cho mục đích gì?</h6>\n    <p>Anh/chị có thể sử dụng XEMAYVINHTRUONG.VN để tổ chức quay số trúng thưởng trong các sự kiện marketing, tri ân khách hàng hoặc sự kiện cuối năm (Year End Party)...</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Làm thế nào để liên hệ với XEMAYVINHTRUONG.VN?</h6>\n    <ul>\n      <li>Địa chỉ: 51 Ô 1 Khu 1 Thị Trấn Chợ Gạo, Tiền Giang.</li>\n      <li>Điện thoại: 0333 444 402 </li>\n      <li>Email: chusunpro@gmail.com</li>\n    </ul>\n  </li>\n</ol>\n'), n.put("templates/vi/tab-faq.html", '<ol class="tab-items">\n  <li class="tab-item">\n    <h6>Quay số bằng bàn phím như thế nào?</h6>\n    <ul>\n      <li><strong>Enter</strong> để Bắt đầu hoặc Dừng quay số.</li>\n      <li><strong>Dấu cộng (+)</strong> để Xác nhận kết quả một lần quay số.</li>\n      <li><strong>Dấu trừ (-)</strong> để Hủy bỏ kết quả một lần quay.</li>\n      <li><strong>Phím Trái / Phải</strong> để chuyển qua lại các giải thưởng.</li>\n    </ul>\n  </li>\n\n  <li class="tab-item">\n    <h6>XEMAYVINHTRUONG.VN có hoạt động được khi không có Internet?</h6>\n    <p>Sau khi thiết lập mã quay thưởng và các giải thưởng, anh/chị chuyển sang chế độ Trình chiếu để bắt đầu. Sau đó anh/chị có thể ngắt kết nối và phần mềm vẫn hoạt động bình thường.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Có thể thay logo, đổi hình nền hoặc thay ảnh các phần thưởng được không?</h6>\n    <p>Anh/chị có thể chủ động chỉnh sửa tất cả mọi thứ cho phù hợp với sự kiện. Sau khi <a ng-click="$ctrl.modals.open(\'Register\')">đăng ký tài khoản</a> và đăng nhập, anh chị sẽ nhìn thấy màn hình chỉnh sửa của XEMAYVINHTRUONG.VN</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Nguyên tắc hoạt động của XEMAYVINHTRUONG.VN?</h6>\n    <ul>\n      <li>Mỗi lần anh/chị đăng nhập vào tài khoản, XEMAYVINHTRUONG.VN sẽ tính là một phiên quay thưởng.</li>\n      <li>Mỗi mã số quay thưởng (ID) chỉ được nhận một giải thưởng. ID đã trúng một giải sẽ được loại trừ khỏi các lần quay thưởng tiếp theo của cùng một phiên quay thưởng.</li>\n    </ul>\n  </li>\n\n  <li class="tab-item">\n    <h6>Danh sách quay thưởng của tôi có cả chữ số và chữ cái, độ dài 20 ký tự thì có quay được không?</h6>\n    <p>LuckyDraw chấp nhận tất cả các ký tự đặc biệt, bao gồm cả dấu !@#$%^*. Đồng thời phần mềm tự động điều chỉnh các ô quay số cho phù hợp với độ dài mã số quay thưởng, tối đa 23 ký tự.</p>\n  </li>\n\n  <li class="tab-item">\n    <h6>Chi phí thuê bao phần mềm là bao nhiêu?</h6>\n    <p>Vui lòng <a ng-click="$ctrl.modals.open(\'Payment\')">nhấn vào đây</a> để xem phí sử dụng (anh/chị cần đăng nhập tài khoản trước).</p>\n  </li>\n</ol>\n\n')
}]), angular.module("app").config(routesConfig);
//# sourceMappingURL=../maps/scripts/app-717293a702.js.map