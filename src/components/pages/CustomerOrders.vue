<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center" :style="{backgroundImage: `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
               <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
              <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{item.price}} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addToCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary" @click="addToCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="my-5 row justify-content-center">
      <table class="table w-75">
        <thead>
        <th></th>
        <th>品名</th>
        <th>數量</th>
        <th>單價</th>
        </thead>
        <tbody>
        <tr v-for="item in cart.carts">
          <td class="align-middle">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
              <i class="far fa-trash-alt"></i>
            </button>
          </td>
          <td class="align-middle">
            {{ item.product.title }}
            <div class="text-success" v-if="item.coupon">
              已套用優惠券
            </div>
          </td>
          <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
          <td class="align-middle text-right">{{ item.final_total }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td colspan="3" class="text-right">總計</td>
          <td class="text-right">{{ cart.total }}</td>
        </tr>
        <tr v-if="cart.final_total !== cart.total">
          <td colspan="3" class="text-right text-success">折扣價</td>
          <td class="text-right text-success">{{ cart.final_total }}</td>
        </tr>
        </tfoot>
      </table>
      <div class="input-group mb-3 input-group-sm w-75">
        <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
            套用優惠碼
          </button>
        </div>
      </div>
    </div>
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input type="email" class="form-control" name="email" id="useremail"
                 v-model="form.user.email" placeholder="請輸入 Email" v-validate="'required|email'">
          <span class="text-danger" v-if="errors.has('email')">
            {{errors.first('email')}}
          </span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" id="username"
                 :class="{'is-invalid': errors.has('name')}"
                 v-model="form.user.name" placeholder="輸入姓名" v-validate="'required'">
          <span class="text-danger" v-if="errors.has('name')">姓名必須輸入</span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input type="address" class="form-control" name="address" id="useraddress" v-model="form.user.address"
                 placeholder="請輸入地址" v-validate="'required'" :class="{'is-invalid': errors.has('address')}">
          <span class="text-danger" v-if="errors.has('address')">{{errors.first('address')}}</span>
        </div>

        <div class="form-group">
          <label for="useraddress">留言</label>
          <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';

  export default {
    name: "CustomerOrders",
    data() {
      return {
        products: [],
        product: {},
        cart: {},
        form: {
          user: {
            name: '',
            email: '',
            tel: '',
            address: ''
          },
          message: '',
        },
        isLoading: false,
        status: {
          loadingItem: '', // 產品 id
        },
        coupon_code: '',
      }
    },
    methods: {
      getProducts() {
        const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`;
        const vm = this;
        vm.isLoading = true;
        this.$http.get(api).then((res) => {
          if (res.data.success) {
            vm.products = res.data.products;
            vm.isLoading = false;
          }
        })
      },
      getProduct(id) {
        const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/product/${id}`;
        const vm = this;
        vm.status.loadingItem = id;
        this.$http.get(api).then((res) => {
          if (res.data.success) {
            $('#productModal').modal('show');
            vm.product = res.data.product;
            vm.status.loadingItem = '';
          }
        })
      },
      addToCart(id, qty = 1) {
        const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
        const vm = this;
        vm.status.loadingItem = id;
        const cart = {
          product_id: id,
          qty
        };
        this.$http.post(api, {data: cart}).then((res) => {
          if (res.data.success) {
            vm.status.loadingItem = '';
            vm.getCart();
            $('#productModal').modal('hide');
          }
        })
      },
      getCart() {
        const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
        const vm = this;
        vm.isLoading = true;
        this.$http.get(api).then((res) => {
          if (res.data.success) {
            vm.cart = res.data.data;
            vm.isLoading = false;
          }
        })
      },
      removeCartItem(id) {
        const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
        const vm = this;
        vm.isLoading = true;
        this.$http.delete(api).then((res) => {
          if (res.data.success) {
            vm.getCart();
          }
          vm.isLoading = false;
        })
      },
      addCouponCode() {
        const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`;
        const vm = this;
        const coupon = {
          code: vm.coupon_code
        };
        vm.isLoading = true;
        this.$http.post(api, {data: coupon}).then((res) => {
          if (res.data.success) {
            vm.getCart();
          } else {
            this.$bus.$emit('message:push', res.data.message, 'danger');
          }
          vm.isLoading = false;
        })
      },
      createOrder() {
        const vm = this;
        this.$validator.validate().then((result) => {
          if (result) {
            const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
            const order = vm.form;
            vm.isLoading = true;
            vm.$http.post(api, {data: order}).then((res) => {
              if (res.data.success) {
                vm.getCart();
                vm.form = {
                  user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: ''
                  },
                  message: '',
                };
              } else {
                vm.$bus.$emit('message:push', res.data.message, 'danger');
              }
              vm.isLoading = false;
              vm.$validator.reset();
            })
          }
        });
      },
    },
    created() {
      this.getProducts();
      this.getCart();
    }
  }
</script>

<style scoped>

</style>
