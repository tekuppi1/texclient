(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var app = angular.module('texchange_books', []).controller('MainController', function ($scope) {
	$scope.parents = [{
		id: 1,
		name: "南山大学"
	}, {
		id: 2,
		name: "名古屋大学"
	}, {
		id: 3,
		name: "その他"
	}];
	$scope.categories = [{
		id: 1,
		parent: 1,
		name: "nanzan-1"
	}, {
		id: 2,
		parent: 1,
		name: "nanzan-2"
	}, {
		id: 3,
		parent: 1,
		name: "nanzan-3"
	}, {
		id: 4,
		parent: 2,
		name: "meidai-1"
	}, {
		id: 5,
		parent: 2,
		name: "meidai-2"
	}, {
		id: 6,
		parent: 3,
		name: "other-1"
	}];
	$scope.books = [{
		id: 1,
		category: 1,
		title: "民法〈2〉物権・担保物権 (ファンダメンタル法学講座)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51YCHjbcDeL._SL160_.jpg",
		author: "nanzan-1",
		point: 2,
		amazon: 3672,
		count: 1,
		description: ""
	}, {
		id: 2,
		category: 1,
		title: "TOEIC(R) テスト BEYOND 990 超上級リーディング 7つのコアスキル",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51q6IJjNfbL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 3,
		category: 2,
		title: "微分",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/4133qr1x9rL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 4,
		category: 2,
		title: "新TOEIC TEST サラリーマン特急 満点リーディング",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51YCHjbcDeL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 5,
		category: 3,
		title: "長考力 1000手先を読む技術 (幻冬舎新書)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/31p9ELA9OEL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 6,
		category: 3,
		title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 7,
		category: 4,
		title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 8,
		category: 1,
		title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 9,
		category: 1,
		title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 10,
		category: 1,
		title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}, {
		id: 11,
		category: 6,
		title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
		img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
		author: "テッド寺倉",
		point: 2,
		amazon: 2484,
		count: 1,
		description: ""
	}];
});

},{}]},{},[1]);
