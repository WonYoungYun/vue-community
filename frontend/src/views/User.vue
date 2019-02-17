<template>
  <v-container fluid grid-list-md>
    <v-layout align-center justify-center>
      <v-flex xs12 md6>
        <v-container>
          <v-card>
            <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img>

            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
                <div>Located two hours south of Sydney in the
                  <br>Southern Highlands of New South Wales, ...
                </div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat color="orange">Share</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
        <v-container>
          <v-card color="blue-grey darken-2" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">Unlimited music now</div>
                <span>Listen to your favorite artists and albums whenever and wherever, online and offline.</span>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat dark>Listen now</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
        <v-container>
          <v-card color="cyan darken-2" class="white--text">
            <v-layout>
              <v-flex xs5>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div class="headline">Supermodel</div>
                    <div>Foster the People</div>
                    <div>(2014)</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">Rate this album
              <v-spacer></v-spacer>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
            </v-card-actions>
          </v-card>
        </v-container>
        <v-container>
          <v-card color="purple" class="white--text">
            <v-layout row>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div class="headline">Halycon Days</div>
                    <div>Ellie Goulding</div>
                    <div>(2013)</div>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs5>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">Rate this album
              <v-spacer></v-spacer>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
              <v-icon>star_border</v-icon>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>



<script>
export default {
  data() {
    return {
      user: {
        name: "",
        id: "",
        lv: "",
        img: "",
        regDate: ""
      }
    };
  },

  mounted() {
    this.user = this.$store.state.user;
    console.log(this.user);
  }
};
</script>

