<template>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <div class="tweet-menu-wrapper">
      <div class="tweet-menu">
        <select v-model="sortBy" name="sortBy">
          <option value="date">Sort by date</option>
          <option value="likes">Sort by likes</option>
        </select>
      </div>
    </div>

    <div class="tweets__wrapper" v-for="item in dataSortered" :key="item.id">
      <Tweet
        :id="item.id"
        :likes="likesTweet(item)"
        :name="item.date"
        :imgUrl="item.avatar"
        @onSubmit="handleLikeSubmit(item)"
      >
        <div class="md-body" v-html="compiledMarced(item.body)"></div>
      </Tweet>
    </div>

    <button @click="handleModalShow" class="btn btnTweet btnTweetHome">
      New tweet
    </button>
    <Modal title="New Tweet" v-if="showModal" @onClose="handleModalShow">
      <TweetForm @onSubmit="handleTweetSubmit" />
    </Modal>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watchEffect } from 'vue'

import Spinner from '@/components/UI/Spinner.vue'
import Tweet from '@/components/UI/Tweet.vue'
import TweetForm from '@/components/UI/TweetForm.vue'
import Modal from '@/components/UI/Modal.vue'
import { marked } from 'marked'
import { useStore } from 'vuex'

export default {
  components: { Spinner, Tweet, TweetForm, Modal },
  setup() {
    const store = useStore();
    //TWEETS DATA
    const data = computed(() => store.getters.getTweets);
    //mounted 
    onMounted(() => {
      if(!data.value){
        getTweets()
      }
      store.dispatch('getLikesStore')
    })

    const getTweets = () => {
      store.dispatch('getTweetsFirebase')
    }
    watchEffect(()=> {
      if(!data.value){
        setTimeout(() => {isLoading.value = false}, 1000 )
      }
    })

    // ITEM TWEET
    //item tweet
    const tweet = reactive({
      body: '',
      avatar:  `https://avatars.dicebear.com/api/male/${Date.now()}.svg`,
      likes: 0,
      date: new Date(Date.now()).toLocaleString()
    })
    //add tweet
    const handleTweetSubmit = body => {
      tweet.body = body;
      handleModalShow();
      store.dispatch('addTweet', tweet)
      .then((res) => {
        if(res.data){
          getTweets()
        }
      })
      .catch((e) => {
        console.log(e)
      })
    }
    //marced item tweet
    const compiledMarced = (test) => {
      return marked.parse(test, {mangle: false, headerIds: false});
    }

    //LIKES
    // получаем все лайки с vuex
    const arrLikes = computed(() => store.getters.getLikes);
    // осртируем лайки если они есть в массиве то данный твит нельзя больше лайкать
    const likesTweet = (item) => {
      let itemLike = {num: null, hide: false}
      let find = arrLikes.value.find(el => el == item.id);
      if(find){
        itemLike.num = item.likes;
        itemLike.hide = true;
      }else{
        itemLike.num = item.likes;
      }
      return itemLike
    }
    const handleLikeSubmit = (tweet) => {
      store.dispatch('editTweet', tweet)
      .then(() => likesTweet(tweet))
      .catch((e) => {
        console.log(e)
      })

    }

    //SORTING
    const sortBy = ref('date');
    const dataSortered = computed(() => {
      return data.value.sort((a, b) => {
        if (a[sortBy.value] < b[sortBy.value]) return 1
        if (a[sortBy.value] > b[sortBy.value]) return -1
      })
    })

    //LOADING DATA (TWEETS)
    const isLoading = ref(true);

    // MODAL
    const showModal = ref(false)
    const handleModalShow = () => {
      const nextShowModal = (showModal.value = !showModal.value)
      showModal.value = nextShowModal
    }

    return {
      data,
      handleTweetSubmit,
      handleLikeSubmit,
      compiledMarced,
      sortBy,
      dataSortered,
      likesTweet,
      isLoading,
      showModal,
      handleModalShow
    }
  }
}
</script>
