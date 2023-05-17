import { createStore } from 'vuex'
import { setItem, getItems } from '@/utils'
import http from '@/http-common'

export const store = createStore({
  state: {
    tweets: null,
    likes: []
  },
  mutations: {
    getTweetsFirebase(store, tweetsArr) {
        store.tweets = tweetsArr;
    },
    addLike(store, tweetID) {
        store.likes.push(tweetID);
        let arr = JSON.stringify(store.likes)
        setItem(arr)
    },
    getLikesStore(store, arrLikes) {
        store.likes = arrLikes;
    }
  },
  actions: {
    // получаем массив твитов
    getTweetsFirebase(context){
        http.get('/tweets.json')
        .then((res) => {
          const newData = [];
          Object.keys(res.data).forEach(key => {
            const item = res.data[key];
            newData.push({id: key, ...item});
          })
          context.commit('getTweetsFirebase', newData)
        })
        .catch((e) => console.log(e))
    },
    // добавление твита
    addTweet(context, tweet) {
       return  http.post('/tweets.json', tweet )
    },
    // добавление лайка по твиту
    editTweet(context, tweet) {
        context.commit('addLike', tweet.id);
        return http.put(`/tweets/${tweet.id}.json`, {...tweet, likes: tweet.likes +=1 })
    },
    // загрузка массива id твитов у которых уже пользователь проставил лайки
    getLikesStore(context) {
        let arr  = getItems();
        if(arr){context.commit('getLikesStore', arr)}
    }
  },
  getters: {
    getTweets(state) {
      return state.tweets
    },
    getLikes(state) {
        return state.likes
    }
  },
})
