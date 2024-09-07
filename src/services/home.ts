import type { PageParams, PageResult } from "@/types/global"
import type { BannerItem, CategoryItem, GuessItem, HotItem } from "@/types/home"
import { http } from "@/utils/http"



// 获取banner区域数据
export const getHomeBanner = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite
    }
  })
}


// 获取前台分类数据
export const getHomeCategory = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: "/home/category/mutli",
  })
}

// services/home.ts
/**
 * 首页-热门推荐-小程序
 */
export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}


// src/services/home.ts
/**
 * 猜你喜欢-小程序
 */
export const getHomeGoodsGuessLikeAPI = (data?:PageParams) => {
  return http<PageResult<GuessItem>>({
    method: 'GET',
    url: '/home/goods/guessLike',
    data
  })
}