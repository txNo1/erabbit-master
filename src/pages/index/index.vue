<script setup lang="ts">
// import XtxSwiper from '@/components/XtxSwiper.vue';
import { getHomeBanner,getHomeCategory,getHomeGoodsGuessLikeAPI,getHomeHotAPI } from '@/services/home';
import CustomNavbar from './components/CustomNavbar.vue';
import CategoryPanel from './components/CategoryPanel.vue';
import HotPanel from './components/HotPanel.vue';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { BannerItem,CategoryItem,HotItem } from '@/types/home';
import type { XtxGuessInstance } from '@/types/component';
// 轮播图数据
const homeBannerList = ref<BannerItem[]>([])
// 分类数据
const homeCategoryList = ref<CategoryItem[]>([])
// 热门推荐数据
const homeHotList = ref<HotItem[]>([])
// 调用首页轮播图数据api
const getHomeBannerData = async()=>{
  const res = await getHomeBanner()
  homeBannerList.value = res.result
}

// 获取前台分类接口
const getHomeCategoryData = async()=>{
  const res = await getHomeCategory()
  homeCategoryList.value = res.result
}
// 获取热门推荐接口
const HomeHotData = async()=>{
  const res = await getHomeHotAPI()
  homeHotList.value = res.result
}

// 获取猜你喜欢组件实例
const guessRef = ref<XtxGuessInstance>()

// 滚动触底事件
const onScrolltolower = ()=>{
    guessRef.value?.getMore()
}
// 定义下拉刷新的状态
const isTriggered = ref(false)

// 定义下拉刷新事件
const onRefresherrefresh = async()=>{
  // 开启加载动画
  isTriggered.value = true
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    HomeHotData(),
    guessRef.value?.getMore()
  ])
  // 关闭加载动画
  isTriggered.value = false
}

onLoad(()=>{
  getHomeBannerData()
  getHomeCategoryData()
  HomeHotData()
})
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  
    <scroll-view 
      @scrolltolower="onScrolltolower" 
      @refresherrefresh="onRefresherrefresh" 
      :refresher-triggered="isTriggered"
      refresher-enabled class="scrollView" 
      scroll-y>
          <!-- 轮播图组件 -->
          <XtxSwiper :list="homeBannerList"/>
          <!-- 首页分类组件 -->
          <CategoryPanel :list = "homeCategoryList"/>
          <!-- 热门推荐模块 -->
          <HotPanel :list="homeHotList"/>
          <!-- 猜你喜欢模块 -->
          <XtxGuess ref="guessRef"/>
    </scroll-view>
</template>

<style lang="scss">
//
page{
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scrollView{
  flex: 1;
}
</style>