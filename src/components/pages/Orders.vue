<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{order.create_at}}</td>
        <td>{{order.user.email}}</td>
        <td v-html="convertProductsToStr(order.products)"></td>
        <td>{{order.total | currency}}</td>
        <td :style="{color: order.is_paid ? 'green' : 'gray'}">{{order.is_paid ? '已付款' : '尚未啟用'}}</td>
      </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-center">
      <Pagination :current-page="pagination.current_page"
                  :total-pages="pagination.total_pages"
                  :has-pre="pagination.has_pre"
                  :has-next="pagination.has_next"
                  @gopage="goPage">
      </Pagination>
    </div>
  </div>
</template>

<script>
  import Pagination from '../Pagination'

  export default {
    components: {
      Pagination,
    },
    name: "Orders",
    data() {
      return {
        orders: [],
        pagination: {},
        isLoading: false,
      };
    },
    methods: {
      getOrders(page = 1) {
        const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/orders?page=${page}`;
        const vm = this;
        vm.isLoading = true;
        this.$http.get(api).then((res) => {
          if (res.data.success) {
            vm.orders = res.data.orders;
            vm.pagination = res.data.pagination;
          } else {
            this.$bus.$emit('message:push', res.data.message, 'danger');
          }
          vm.isLoading = false;
        })
      },
      convertProductsToStr(products) {
        return Object.values({...products})
          .map(product => (`${product.product_id}: ${product.qty}`))
          .join(`<br/>`);
      },
      goPage(page) {
        this.getOrders(page);
      },
    },
    created() {
      this.getOrders();
    },
  }
</script>

<style scoped>

</style>
