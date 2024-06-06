<template>
    <div class="company tabs">
        <hp-tabs :options="[
            { label: 'Company Details', value: 'active' },
            { label: 'Description', value: 'description' },
            { label: 'Social Media', value: 'social_media' },
            { label: 'Images', value: 'images' },
        ]" v-model="state" />
        <div v-if="state === 'active'" class="company__details">
            <span class="company_slogan"> {{ details?.company.name }}</span>
            <div class="company__details__container">
                <hp-icon class="icon" name="company" :size="28"></hp-icon>
                <span class="label"> {{ details?.name }}</span>
            </div>
            <div class="company__details__container">
                <hp-icon name="link" :size="28"></hp-icon>

                <span class="label"> {{ details?.domain }}</span>
            </div>
            <div class="company__details__container">
                <hp-icon name="location" :size="28"></hp-icon>

                <span class="label"> {{ details?.company.location.city }} 
                    {{ details?.company.location.state }} 
                    {{ details?.company.location.country }}</span>
            </div>
            <div class="company__details__container">
                <hp-icon name="employees" :size="28"></hp-icon>

                <span class="label"> {{ details?.company.employees }}</span>
            </div>
            <!-- <div class="company__details__container">
                <hp-icon name="description" :size="28"></hp-icon>

                <span class="label"> {{ details?.longDescription }}</span>
            </div> -->
        </div>
        <div v-if="state === 'description'" class="company__details">
            <span class="company__description"> {{ details?.longDescription }}</span>
        </div>
        <div v-if="state === 'social_media'" class="company__details">
            <a :href="details?.links[0].url" 
            target="_blank" class="company__details__container">
                <hp-icon class="icon" name="instagram" :size="28"></hp-icon>
                <span  class="label"> {{ details?.links[0].url }}</span>
            </a>
            <a :href="details?.links[1].url" 
            target="_blank" class="company__details__container">
                <hp-icon class="icon" name="linkdein" :size="28"></hp-icon>
                <span  class="label"> {{ details?.links[0].url }}</span>
            </a>
            <a :href="details?.links[2].url" 
            target="_blank" class="company__details__container">
                <hp-icon class="icon" name="youtube" :size="28"></hp-icon>
                <span  class="label"> {{ details?.links[2].url }}</span>
            </a>
        </div>
        <div v-if="state === 'images'" class="company__details" style="display: flex;"  >
            <!-- <div class="" style="font-size: 1.8rem; font-weight: bold;margin-bottom: 1rem">
                Logo
            </div> -->
         <img style="margin-right: 1rem;"  :src="details?.logos[0].formats[0].src" alt=""/>
            <!-- <div class="" style="font-size: 1.8rem; font-weight: bold;margin-bottom: 1rem">
                Logo
            </div> -->
         <img :src="details?.logos[1].formats[0].src" alt=""/>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import HpIcon from "@/components/hp-icon.vue";
import HpTabs from "@/components/hp-tabs.vue";
const state = ref("active");
const details = {
    "id": "idtXHh_IHh",
    "name": "Adven",
    "domain": "adven.com",
    "claimed": false,
    "description": "We provide energy efficient district heating, geoenergy, steam, heat, cooling, and water treatment for industrial and real estate businesses.",
    "longDescription": "Adven is a leading energy group dedicated to driving the energy transition and developing sustainable solutions in partnership with customers and suppliers. With a focus on making a difference in a changing world, Adven offers a range of products and services to meet the energy needs of individuals, communities, and companies. Their Energy as a Service® model provides tailor-made, long-term partnerships, ensuring reliable and efficient energy solutions. Adven's expertise spans various industries, including energy efficiency, production, and recovery, as well as water treatment in sectors such as food and beverage, pulp and paper, metal and mining, and chemical and pharmaceuticals. With a vision to be the leading partner in the energy transition, Adven is committed to delivering sustainable and competitive solutions for societies today and in the future. Their emphasis on strong partnerships, renewable energy sources, and sustainable solutions reflects their dedication to creating a better tomorrow. Operating in multiple countries, including Finland, Sweden, Estonia, Latvia, and the Netherlands, Adven is continuously expanding its reach to meet the evolving needs of its customers.",
    "links": [
        {
            "name": "instagram",
            "url": "https://instagram.com/adven_group"
        },
        {
            "name": "linkedin",
            "url": "https://linkedin.com/company/adven-group"
        },
        {
            "name": "youtube",
            "url": "https://youtube.com/channel/UCV1EAMDBJEKgU3U4PqPMhbg"
        }
    ],
    "logos": [
        {
            "theme": "dark",
            "formats": [
                {
                    "src": "https://asset.brandfetch.io/idtXHh_IHh/idTNBaKcXU.png",
                    "background": "transparent",
                    "format": "png",
                    "height": 86,
                    "width": 260,
                    "size": 13685
                }
            ],
            "tags": [],
            "type": "logo"
        },
        {
            "theme": "dark",
            "formats": [
                {
                    "src": "https://asset.brandfetch.io/idtXHh_IHh/idniA0qEBS.jpeg",
                    "background": null,
                    "format": "jpeg",
                    "height": 200,
                    "width": 200,
                    "size": 2713
                }
            ],
            "tags": [],
            "type": "icon"
        }
    ],
    "colors": [
        {
            "hex": "#141414",
            "type": "dark",
            "brightness": 20
        },
        {
            "hex": "#ffffff",
            "type": "light",
            "brightness": 255
        },
        {
            "hex": "#9e6e48",
            "type": "accent",
            "brightness": 117
        }
    ],
    "fonts": [
        {
            "name": "Helvetica Neue",
            "type": "body",
            "origin": "custom",
            "originId": null,
            "weights": []
        },
        {
            "name": "Helvetica Neue",
            "type": "body",
            "origin": "custom",
            "originId": null,
            "weights": []
        },
        {
            "name": "Aventa",
            "type": "title",
            "origin": "custom",
            "originId": null,
            "weights": []
        }
    ],
    "images": [],
    "qualityScore": 0.48989538247384556,
    "company": {
        "employees": 501,
        "foundedYear": null,
        "industries": [
            {
                "score": 1,
                "id": "100",
                "name": "Energy Industry",
                "emoji": "🏭",
                "parent": {
                    "emoji": "🏭",
                    "id": "94",
                    "name": "Heavy Industry and Engineering",
                    "slug": "heavy-industry-and-engineering"
                },
                "slug": "energy-industry"
            },
            {
                "score": 1,
                "id": "94",
                "name": "Heavy Industry and Engineering",
                "emoji": "🏭",
                "parent": null,
                "slug": "heavy-industry-and-engineering"
            }
        ],
        "kind": "PRIVATELY_HELD",
        "location": {
            "city": "Vantaa",
            "country": "Finland",
            "countryCode": "FI",
            "region": "Europe",
            "state": "Uusimaa",
            "subregion": "Northern Europe"
        },
        "name": "Adven – The leading partner in the energy transition"
    },
    "isNsfw": false
}
</script>
<style lang="scss" scoped>
.company {
    width: 100vw;
    border-radius: 1rem;
    background-color: #252d33;
    height: 80vh;
    // border: 1px solid red;
    padding: 1rem;
    &_slogan{
    @include text-h2;
    }
&__description{
    font-size: 1.25rem;
    line-height: 1.875rem;
    font-weight: bolder;
}
    &__details {
        padding: 1rem;

        .label {
            padding-left: 10px;
        }

        &__container {
            display: flex;
            font-size: 1.5rem;
            margin: 1.5rem 0;


        }
    }
}
</style>