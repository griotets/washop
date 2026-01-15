<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('admin.productsNew.title') }}</h1>
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/products" class="rounded-lg border bg-white px-3 py-2 text-sm">{{ t('admin.productsNew.backToList') }}</NuxtLink>
        <button class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" :disabled="saving || !isValid" @click="save">{{ t('admin.productsNew.save') }}</button>
      </div>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <label class="block text-sm font-medium">{{ t('admin.productsNew.fields.name') }}</label>
          <input v-model.trim="form.name" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.fields.type') }}</label>
              <select v-model="form.type" class="mt-1 w-full rounded-lg border px-3 py-2">
                <option value="physical">{{ t('admin.productsNew.type.physical') }}</option>
                <option value="digital">{{ t('admin.productsNew.type.digital') }}</option>
                <option value="reservation">{{ t('admin.productsNew.type.reservation') }}</option>
                <option value="subscription">{{ t('admin.productsNew.type.subscription') }}</option>
                <option value="other">{{ t('admin.productsNew.type.other') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.priceLabel') }}</label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
              <p v-if="priceError" class="mt-1 text-xs text-red-600">{{ priceError }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.fields.original_price') }}</label>
              <input v-model.number="form.original_price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div class="sm:col-span-3 grid gap-4 sm:grid-cols-3 mt-2">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.show_estimated_price" />
                <span class="text-sm">{{ t('admin.productsNew.fields.showEstimatedPrice') }}</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.track_cost" />
                <span class="text-sm">{{ t('admin.productsNew.fields.trackCost') }}</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.show_net_price" />
                <span class="text-sm">{{ t('admin.productsNew.fields.showNetPrice') }}</span>
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.fields.sku') }}</label>
              <input v-model.trim="form.sku" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.fields.weight') }}</label>
              <div class="flex items-center gap-2">
                <input v-model.number="form.weight" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
                <span class="text-sm text-gray-600">{{ t('admin.productsNew.fields.weightUnit') }}</span>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium">{{ t('admin.productsNew.fields.description') }}</label>
              <button @click="generateDescription" :disabled="generatingDesc" class="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50">
                <Sparkles class="h-3 w-3" /> {{ generatingDesc ? t('admin.productsNew.description.writing') : t('admin.productsNew.description.generate') }}
              </button>
            </div>
            <textarea v-model.trim="form.description" rows="4" class="mt-1 w-full rounded-lg border px-3 py-2" :placeholder="t('admin.productsNew.description.placeholder')"></textarea>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.category.label') }}</label>
              <div class="relative">
                <input v-model.trim="categorySearch" @focus="categoryOpen=true" @input="categoryOpen=true" @blur="closeCategoryDropdownLater" :placeholder="t('admin.productsNew.category.searchPlaceholder')" class="mt-1 w-full rounded-lg border px-3 py-2" />
                <div v-if="categoryOpen" class="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow">
                  <button class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100" @click="selectCategory(null)">{{ t('admin.productsNew.category.none') }}</button>
                  <button v-for="c in filteredCategories" :key="c.id" class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100" @click="selectCategory(c)">{{ c.name }}</button>
                  <div class="border-t px-3 py-2">
                    <div class="text-xs text-gray-600 mb-1">{{ t('admin.productsNew.category.create', { name: (categorySearch || '...') }) }}</div>
                    <button class="rounded-lg border bg-white px-3 py-2 text-xs" @click="createCategoryFromSearch">{{ t('admin.productsNew.category.createButton') }}</button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.tags.label') }}</label>
              <div class="mt-1 flex flex-wrap gap-2">
                <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="selectedTags.has(Number(t.id))?'bg-green-100 border-green-300':'bg-white'" @click="toggleTag(Number(t.id))">{{ t.name }}</button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <input v-model.trim="newTagName" :placeholder="t('admin.productsNew.tags.addPlaceholder')" class="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="createTag" :disabled="tagCreating">{{ tagCreating ? '...' : t('admin.productsNew.tags.create') }}</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ t('admin.productsNew.generatePro.title') }}</div>
            <div class="flex items-center gap-2">
              <button 
                v-if="!admin.isFreePlan" 
                class="inline-flex items-center gap-1 rounded bg-purple-600 px-3 py-2 text-sm font-semibold text-white"
                @click="showGenerateModal = true"
              >
                <Sparkles class="h-4 w-4" /> {{ t('admin.productsNew.generatePro.button') }}
              </button>
              <NuxtLink 
                v-else 
                to="/admin/settings?tab=billing" 
                class="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600"
              >
                <Sparkles class="h-4 w-4" /> {{ t('admin.productsNew.generatePro.locked') }}
              </NuxtLink>
            </div>
          </div>
          <div class="mt-3 text-sm text-gray-600">
            {{ t('admin.productsNew.generatePro.desc') }}
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ t('admin.productsNew.images.title') }}</div>
            <input ref="imageFileInput" type="file" accept="image/*" class="hidden" multiple @change="onImageFile" />
          </div>
          <div class="mt-3 relative">
            <div v-if="imageUploadLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-lg">
               <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent"></div>
            </div>
            <div class="flex items-center justify-center rounded-lg border-2 border-dashed px-4 py-10 text-center cursor-pointer" :class="dropActive?'border-green-400 bg-green-50':'border-gray-300 bg-gray-50'" @click="triggerImageInput" @dragenter.prevent="onImageDragEnter" @dragover.prevent="onImageDragOver" @dragleave.prevent="onImageDragLeave" @drop.prevent="onImageDrop">
              <div>
                <Upload class="mx-auto h-8 w-8 text-gray-400" />
                <div class="mt-2 text-sm font-medium text-gray-800">{{ t('admin.productsNew.images.dropTitle') }}</div>
                <div class="mt-1 text-xs text-gray-500">{{ t('admin.productsNew.images.dropHint') }}</div>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <input v-model.trim="imageUrl" :placeholder="t('common.urlPlaceholder')" class="flex-1 rounded-lg border px-3 py-2 text-sm" />
            <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="addImageUrl">{{ t('admin.productsNew.images.addUrl') }}</button>
            <button class="rounded-lg border bg-white px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50" @click="generateImage" :disabled="generatingImage">
              <Wand2 class="h-4 w-4 text-purple-600" /> 
              <span>{{ generatingImage ? '...' : t('admin.productsNew.images.generateAi') }}</span>
            </button>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div v-for="(img,i) in form.images" :key="i" class="relative" draggable="true" @dragstart="onImageTileDragStart(i)" @dragover.prevent @drop="onImageTileDrop(i)">
              <img :src="img" alt="" class="h-24 w-full rounded object-cover bg-gray-100" />
              <button class="absolute right-2 top-2 rounded bg-white/80 px-2 py-1 text-xs" @click="removeImage(i)">{{ t('admin.productsNew.images.remove') }}</button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="grid gap-4 sm:grid-cols-3">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.track_inventory" />
              <span class="text-sm">{{ t('admin.productsNew.inventory.track') }}</span>
            </label>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.inventory.quantity') }}</label>
              <input v-model.number="form.stock_quantity" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
              <p v-if="stockError" class="mt-1 text-xs text-red-600">{{ stockError }}</p>
            </div>
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.is_visible" />
              <span class="text-sm">{{ t('admin.productsNew.visibility.visible') }}</span>
            </label>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.is_out_of_stock" />
              <span class="text-sm">{{ t('admin.productsNew.outOfStock') }}</span>
            </label>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.dailyCapacity') }}</label>
              <input v-model.number="form.daily_capacity" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div class="grid gap-2 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium">{{ t('admin.productsNew.maxOrderQty') }}</label>
                <input v-model.number="form.max_order_qty" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium">{{ t('admin.productsNew.minOrderQty') }}</label>
                <input v-model.number="form.min_order_qty" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
            </div>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.tax_exempt" />
              <span class="text-sm">{{ t('admin.productsNew.tax.exempt') }}</span>
            </label>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.tax.reason') }}</label>
              <input v-model.trim="form.tax_exempt_reason" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.unit.label') }}</label>
              <select v-model="unit" class="mt-1 w-full rounded-lg border px-3 py-2">
                <option value="G">Grammes (G)</option>
                <option value="KG">Kilogrammes (KG)</option>
                <option value="L">Litres (L)</option>
                <option value="ML">Millilitres (ML)</option>
                <option value="PCS">Pièces (PCS)</option>
                <option value="PAX">Personnes (PAX)</option>
                <option value="PERSON">Personne</option>
                <option value="ROOM">Chambre</option>
                <option value="PACK">Pack</option>
                <option value="QTY">Quantité</option>
                <option value="LBS">Livres (LBS)</option>
                <option value="HOUR">Heure</option>
                <option value="BOX">Boîte</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productsNew.unit.value') }}</label>
              <input v-model.number="unitValue" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <label class="inline-flex items-center gap-2 mt-6 sm:mt-0">
              <input type="checkbox" v-model="requiresShipping" />
              <span class="text-sm">{{ t('admin.productsNew.shipping.required') }}</span>
            </label>
          </div>
          <div class="mt-4">
            <div class="text-sm font-medium">{{ t('admin.productsNew.shipping.methods') }}</div>
            <div class="mt-2 flex flex-wrap gap-2">
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('pickup')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('pickup')">{{ t('admin.productsNew.delivery.pickup') }}</button>
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('delivery')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('delivery')">{{ t('admin.productsNew.delivery.delivery') }}</button>
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('dine_in')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('dine_in')">{{ t('admin.productsNew.delivery.dine_in') }}</button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">{{ t('admin.productForm.variantsTitle') }}</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-gray-50" @click="addVariant"><Plus class="h-4 w-4" /><span>{{ t('admin.productForm.add') }}</span></button>
          </div>
          <div class="space-y-4">
            <div v-for="(v,i) in variants" :key="v.id||i" class="rounded-lg border p-4 bg-gray-50/50">
               <div class="flex flex-col sm:flex-row gap-4">
                  <div class="relative h-20 w-20 shrink-0 group">
                    <img :src="v.image_url||''" class="h-full w-full rounded-lg object-cover bg-white border" />
                    <div v-if="v._imgLoading" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"><div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div></div>
                    <label class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                      <Upload class="h-5 w-5 text-white" />
                      <input type="file" accept="image/*" class="hidden" @change="(e:any)=>uploadVariantImage(e,v)" />
                    </label>
                  </div>

                  <div class="flex-1 grid gap-4 sm:grid-cols-3">
                     <div>
                        <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.variantNamePlaceholder') }}</label>
                        <input v-model.trim="v.name" type="text" class="w-full rounded border px-2 py-1.5 text-sm" />
                     </div>
                     <div>
                        <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.variantPricePlaceholder') }}</label>
                        <input v-model.number="v.price" type="number" min="0" step="0.01" class="w-full rounded border px-2 py-1.5 text-sm" />
                     </div>
                     <div>
                        <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.variantOriginalPricePlaceholder') }}</label>
                        <input v-model.number="v.original_price" type="number" min="0" step="0.01" class="w-full rounded border px-2 py-1.5 text-sm" />
                     </div>
                  </div>

                  <div class="flex items-start gap-1 sm:pt-6">
                    <button class="text-gray-500 hover:text-blue-600 p-1" @click="cloneVariant(v)" :title="t('admin.productForm.clone')">
                      <Copy class="h-4 w-4" />
                    </button>
                    <button class="text-gray-500 hover:text-red-600 p-1" @click="deleteVariant(v,i)" :title="t('admin.productForm.delete')">
                      <Trash class="h-4 w-4" />
                    </button>
                  </div>
               </div>
            </div>
            <div v-if="variants.length === 0" class="text-center text-sm text-gray-500 py-4">{{ t('admin.productForm.noVariants') }}</div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">{{ t('admin.productForm.optionsTitle') }}</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-gray-50" @click="addOption"><Plus class="h-4 w-4" /><span>{{ t('admin.productForm.add') }}</span></button>
          </div>
          <div class="space-y-4">
            <div v-for="(o,i) in options" :key="o.id||i" class="rounded-lg border p-4 bg-gray-50/50">
              <div class="grid gap-4 sm:grid-cols-3 mb-3">
                 <div>
                    <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.optionNamePlaceholder') }}</label>
                    <input v-model.trim="o.name" type="text" class="w-full rounded border px-2 py-1.5 text-sm" />
                 </div>
                 <div>
                    <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.optionTypeLabel') }}</label>
                    <select v-model="o.type" class="w-full rounded border px-2 py-1.5 text-sm">
                      <option value="text">{{ t('admin.productForm.optionType.text') }}</option>
                      <option value="number">{{ t('admin.productForm.optionType.number') }}</option>
                      <option value="date">{{ t('admin.productForm.optionType.date') }}</option>
                      <option value="checkbox">{{ t('admin.productForm.optionType.checkbox') }}</option>
                      <option value="select">{{ t('admin.productForm.optionType.select') }}</option>
                      <option value="multiselect">{{ t('admin.productForm.optionType.multiselect') }}</option>
                      <option value="color">{{ t('admin.productForm.optionType.color') }}</option>
                    </select>
                 </div>
                 <div class="flex items-center gap-2 sm:pt-6">
                    <input v-model="o.is_required" type="checkbox" class="h-4 w-4 rounded border-gray-300" :id="'req-'+i" />
                    <label :for="'req-'+i" class="text-sm cursor-pointer select-none">{{ t('admin.productForm.required') }}</label>
                    
                    <div class="ml-auto flex items-center gap-1">
                      <button class="text-gray-500 hover:text-blue-600 p-1" @click="cloneOption(o)" :title="t('admin.productForm.clone')">
                        <Copy class="h-4 w-4" />
                      </button>
                      <button class="text-gray-500 hover:text-red-600 p-1" @click="deleteOption(o,i)" :title="t('admin.productForm.delete')">
                        <Trash class="h-4 w-4" />
                      </button>
                    </div>
                 </div>
              </div>

              <div v-if="['select','color','radio','checkbox','multiselect'].includes(o.type)" class="mt-2 border-t pt-2">
                 <label class="mb-2 block text-xs font-medium text-gray-500">{{ t('admin.productForm.optionValuesPlaceholder') }}</label>
                 <div class="flex flex-wrap gap-2 mb-2">
                    <div v-for="(val, vIdx) in (Array.isArray(o.values) ? o.values : [])" :key="vIdx" class="inline-flex items-center gap-1 rounded bg-white border px-2 py-1 text-sm">
                       <div v-if="o.type==='color'" class="w-3 h-3 rounded-full border" :style="{backgroundColor: val}"></div>
                       <span>{{ val }}</span>
                       <button @click="removeOptionValue(o, Number(vIdx))" class="text-gray-400 hover:text-red-500"><X class="h-3 w-3" /></button>
                    </div>
                 </div>
                 <div class="flex gap-2">
                    <input 
                      type="text" 
                      :placeholder="t('admin.productForm.addValuePlaceholder')" 
                      class="flex-1 rounded border px-2 py-1.5 text-sm"
                      @keydown.enter.prevent="addOptionValue(o, $event)"
                    />
                    <div class="text-xs text-gray-400 self-center hidden sm:block">{{ t('admin.productForm.addValueHint') }}</div>
                 </div>
              </div>
            </div>
            <div v-if="options.length === 0" class="text-center text-sm text-gray-500 py-4">{{ t('admin.productForm.noOptions') }}</div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold">{{ t('admin.productsNew.previewPhoneTitle') }}</div>
          <div class="mt-4 flex justify-center">
            <div class="w-[360px] rounded-3xl border bg-gray-50 p-4">
              <div class="rounded-xl bg-white shadow overflow-hidden">
                <div class="flex items-center gap-3 border-b p-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                    <span class="text-xs font-semibold text-gray-700">{{ storeInitials || 'SB' }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-semibold">{{ storeName || t('catalog.storeFallback') }}</div>
                    <div class="text-xs text-gray-500">{{ t('industryIndex.status.online') }}</div>
                  </div>
                  <a v-if="waLink" :href="waLink" target="_blank" class="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white">WhatsApp</a>
                </div>
                <img :src="form.images[0] || ''" class="h-40 w-full object-cover bg-gray-100" />
                <div class="p-3">
                  <div class="font-semibold">{{ form.name || 'Nom du produit' }}</div>
                  <div class="mt-1 text-sm text-gray-600" style="white-space: pre-line">{{ form.description || 'Description du produit' }}</div>
          <div class="mt-2 text-sm font-semibold">XAF {{ Number(form.price || 0).toLocaleString(getNumberLocale()) }}</div>
                  <div class="mt-3">
                    <a v-if="waLink" :href="waLink" target="_blank" class="block rounded bg-green-500 px-3 py-2 text-sm font-semibold text-white text-center">{{ t('admin.productsNew.preview.whatsappCta') }}</a>
                    <span v-else class="block rounded border bg-white px-3 py-2 text-sm text-center text-gray-600">{{ t('admin.productsNew.preview.noNumber') }}</span>
                  </div>
                </div>
                <div class="border-t p-3 text-sm text-gray-700">
                  {{ t('admin.productsNew.preview.whatsAppLabel') }} {{ storePhone || '—' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="saving" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div class="rounded-xl bg-gray-900/90 px-6 py-5 text-center text-white shadow-xl">
      <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
      <div class="mt-3 text-sm font-semibold">{{ t('admin.productsNew.overlay.creating') }}</div>
    </div>
  </div>
  <div v-if="showGenerateModal" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
    <div class="w-full max-w-xl rounded-xl bg-white shadow-xl">
      <div class="flex items-center justify-between border-b p-4">
        <div class="font-semibold">{{ t('admin.productsNew.generateModal.title') }}</div>
        <button @click="showGenerateModal=false" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <X class="h-5 w-5" />
        </button>
      </div>
      <div class="p-4">
        <textarea v-model.trim="generateText" rows="6" class="w-full rounded-lg border px-3 py-2 text-sm" :placeholder="t('admin.productsNew.generateModal.placeholder')"></textarea>
        <div class="mt-3 text-xs text-gray-500">{{ t('admin.productsNew.generateModal.note') }}</div>
      </div>
      <div class="flex items-center justify-end gap-2 border-t p-4">
        <button @click="showGenerateModal=false" class="rounded-lg border bg-white px-3 py-2 text-sm">{{ t('admin.productsNew.generateModal.cancel') }}</button>
        <button 
          @click="submitGenerate" 
          :disabled="generatingProduct || !generateText || admin.isFreePlan" 
          class="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ generatingProduct ? t('admin.productsNew.generateModal.generating') : t('admin.productsNew.generateModal.submit') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
import { Upload, Sparkles, Wand2, X, Plus, Trash, Copy } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', alias: ['/admin/product/new'] })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { t, locale } = useI18n()
const saving = ref(false)
const generatingDesc = ref(false)
const generatingImage = ref(false)
const showGenerateModal = ref(false)
const generateText = ref('')
const generatingProduct = ref(false)
const toast = useToast()

const form = reactive<any>({
  name: '',
  price: 0,
  original_price: 0,
  sku: '',
  description: '',
  images: [] as string[],
  track_inventory: false,
  stock_quantity: 0,
  is_visible: true,
  is_out_of_stock: false,
  daily_capacity: 0,
  max_order_qty: 0,
  min_order_qty: 0,
  tax_exempt: false,
  tax_exempt_reason: '',
  show_estimated_price: false,
  track_cost: false,
  cost_per_item: 0,
  show_net_price: false,
  weight: 0,
  type: 'physical',
  category_id: null as number | null
})
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const selectedTags = reactive(new Set<number>())
const newTagName = ref('')
const newCategoryName = ref('')
const categorySearch = ref('')
const categoryOpen = ref(false)
const storePhone = ref<string>('')
const storeName = ref<string>('')
const storeInitials = computed(() => (storeName.value || 'SB').split(/\s+/).map(s => s[0]).join('.'))
const waLink = computed(() => {
  const phone = String(storePhone.value || '').trim()
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `https://wa.me/${digits.replace(/^0+/, '')}` : ''
})
function getNumberLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}
const filteredCategories = computed(() => {
  const term = String(categorySearch.value || '').toLowerCase()
  return Array.isArray(categories.value) ? categories.value.filter((c: any) => String(c.name || '').toLowerCase().includes(term)) : []
})
function selectCategory(c: any) {
  form.category_id = c ? Number(c.id) : null
  categorySearch.value = c ? String(c.name || '') : ''
  categoryOpen.value = false
}
  function createCategoryFromSearch() {
    const v = String(categorySearch.value || '').trim()
    if (!v) return
    const exists = filteredCategories.value.find((c: any) => String(c.name || '').toLowerCase() === v.toLowerCase())
    if (exists) { toast.error(t('admin.productsNew.category.exists')); return }
    newCategoryName.value = v
    createCategory()
    categoryOpen.value = false
  }
function closeCategoryDropdownLater() { setTimeout(() => categoryOpen.value = false, 150) }
const variants = ref<any[]>([])
const options = ref<any[]>([])
const unit = ref('PCS')
const unitValue = ref<number | null>(null)
const requiresShipping = ref(true)
const deliveryMethods = reactive(new Set<string>())
function toggleTag(id: number) { if (selectedTags.has(id)) selectedTags.delete(id); else selectedTags.add(id) }
function addNewTagName() {
  const v = String(newTagName.value || '').trim()
  if (!v) return
  tags.value.push({ id: null, name: v, _new: true })
  newTagName.value = ''
}
async function createTag() {
  const name = String(newTagName.value || '').trim()
  if (!name) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  tagCreating.value = true
  try {
    const { data } = await supabase.from('tags').insert({ store_id: storeId, name }).select('id,name').maybeSingle()
    if (data?.id) {
      tags.value.push({ id: data.id, name: data.name })
      selectedTags.add(Number(data.id))
      newTagName.value = ''
    }
  } finally { tagCreating.value = false }
}
  function createCategory() {
    const name = String(newCategoryName.value || '').trim()
    if (!name) { toast.error(t('admin.productsNew.category.invalidName')); return }
    const storeId = admin.selectedShopId
    if (!storeId) { toast.error(t('admin.productsNew.toast.selectStore')); return }
    ;(async () => {
      const { data, error } = await supabase.from('categories').insert({ store_id: storeId, name }).select('id').maybeSingle()
      if (error) { toast.error(t('admin.productsNew.category.createError')); newCategoryName.value = ''; return }
      if (data?.id) {
        form.category_id = Number(data.id)
        toast.success(t('admin.productsNew.category.created'))
        await loadFilters()
      }
      newCategoryName.value = ''
    })()
  }
const imageUploadLoading = ref(false)
const tagCreating = ref(false)
const imageUrl = ref('')
const imageFileInput = ref<HTMLInputElement | null>(null)
const dropActive = ref(false)
function addImageUrl() {
  const url = String(imageUrl.value || '').trim()
  if (!url) return
  form.images.push(url)
  imageUrl.value = ''
}
function removeImage(i: string | number) {
  const idx = typeof i === 'string' ? Number(i) : i
  if (!Number.isFinite(idx)) return
  const url = form.images[idx]
  if (pendingUploads.value.has(url)) {
    URL.revokeObjectURL(url)
    pendingUploads.value.delete(url)
  }
  form.images.splice(idx, 1)
}

  async function onImageFile(e: any) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const MAX = 10 * 1024 * 1024
    for (const f of Array.from(files) as File[]) {
      if (f.size > MAX) { toast.error(t('admin.productsNew.images.fileTooLargeName', { name: f.name })); continue }
      await uploadImage(f)
    }
  }
function triggerImageInput() { imageFileInput.value?.click() }
function onImageDragEnter() { dropActive.value = true }
function onImageDragOver() { dropActive.value = true }
function onImageDragLeave() { dropActive.value = false }
  async function onImageDrop(e: DragEvent) {
    dropActive.value = false
    const files: File[] = []
    const dt = e.dataTransfer
  if (dt?.items && dt.items.length) {
    for (const item of Array.from(dt.items)) {
      if (item.kind === 'file') {
        const f = item.getAsFile()
        if (f) files.push(f)
      }
    }
  } else if (dt?.files && dt.files.length) {
    files.push(...Array.from(dt.files))
  }
    const MAX = 10 * 1024 * 1024
    for (const f of files) {
      if (f.size > MAX) { toast.error(t('admin.productsNew.images.fileTooLarge')); continue }
      await uploadImage(f)
    }
  }
const priceError = computed(() => {
  const price = Number(form.price)
  if (!Number.isFinite(price) || price <= 0) return t('admin.productForm.error.priceRequired')
  return ''
})
const stockError = computed(() => {
  if (!form.track_inventory) return ''
  const stock = Number(form.stock_quantity)
  if (!Number.isFinite(stock) || stock < 0) return t('admin.productForm.error.stockNegative')
  return ''
})
const nameError = computed(() => {
  const name = String(form.name || '').trim()
  if (!name) return t('admin.productForm.error.nameRequired')
  return ''
})
const quantityError = computed(() => {
  const minQty = Number(form.min_order_qty || 0)
  const maxQty = Number(form.max_order_qty || 0)
  if (minQty > 0 && maxQty > 0 && minQty > maxQty) return t('admin.productForm.error.minMaxInvalid')
  return ''
})
const isValid = computed(() => !nameError.value && !priceError.value && !stockError.value && !quantityError.value)
const pendingUploads = ref(new Map<string, File>())

async function uploadFileToStorage(file: File, path: string) {
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'product-images')
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

async function uploadImage(file: File) {
  const previewUrl = URL.createObjectURL(file)
  form.images.push(previewUrl)
  pendingUploads.value.set(previewUrl, file)
}
let dragImageIndex: number | null = null
function onImageTileDragStart(i: string | number) {
  const idx = typeof i === 'string' ? Number(i) : i
  if (!Number.isFinite(idx)) return
  dragImageIndex = idx
}
function onImageTileDrop(i: string | number) {
  const idx = typeof i === 'string' ? Number(i) : i
  if (!Number.isFinite(idx)) return
  if (dragImageIndex === null || dragImageIndex === idx) return
  const v = form.images.splice(dragImageIndex,1)[0]
  form.images.splice(idx,0,v)
  dragImageIndex = null
}
function toggleDelivery(m: string) { if (deliveryMethods.has(m)) deliveryMethods.delete(m); else deliveryMethods.add(m) }
async function uploadVariantImage(e: any, v: any) {
  const file = e.target.files?.[0]
  if (!file) return
  const MAX = 10 * 1024 * 1024
  if (file.size > MAX) {
    toast.error(t('admin.productForm.fileTooLarge'))
    return
  }
  const previewUrl = URL.createObjectURL(file)
  if (v.image_url && v.image_url.startsWith('blob:')) {
    URL.revokeObjectURL(v.image_url)
  }
  v.image_url = previewUrl
  v._pendingFile = file
}
function addVariant() {
  variants.value.push({ name: '', price: 0, original_price: 0, image_url: '' })
}
function cloneVariant(v: any) {
  variants.value.push({
    name: v.name + ' (Copy)',
    price: v.price,
    original_price: v.original_price,
    image_url: v.image_url,
    _imgLoading: false
  })
}
function deleteVariant(v: any, index: number) {
  if (v.image_url && v.image_url.startsWith('blob:')) {
    URL.revokeObjectURL(v.image_url)
  }
  variants.value.splice(index, 1)
}
function addOption() {
  options.value.push({ name: '', type: 'text', values: [], is_required: false })
}
function cloneOption(o: any) {
  options.value.push({
    name: o.name + ' (Copy)',
    type: o.type,
    values: Array.isArray(o.values) ? [...o.values] : [],
    is_required: o.is_required
  })
}
function deleteOption(o: any, index: number) {
  options.value.splice(index, 1)
}
function addOptionValue(o: any, e: any) {
  const val = String(e.target.value || '').trim()
  if (!val) return
  if (Array.isArray(o.values) && o.values.length >= 10) {
    toast.error(t('admin.productForm.optionValuesMax10'))
    return
  }
  if (!Array.isArray(o.values)) o.values = []
  if (!o.values.includes(val)) o.values.push(val)
  e.target.value = ''
}
function removeOptionValue(o: any, index: number | string) {
  const idx = typeof index === 'string' ? Number(index) : index
  if (!Number.isFinite(idx)) return
  if (Array.isArray(o.values)) o.values.splice(idx, 1)
}

  async function generateDescription() {
    if (!form.name) {
      toast.error(t('admin.productsNew.description.enterName'))
      return
    }
    generatingDesc.value = true
    try {
    const { description } = await $fetch<{ description?: string }>('/api/ai/generate-description', {
      method: 'POST',
      body: { 
        name: form.name,
        keywords: [form.sku].filter(Boolean).join(', ')
      }
    })
      if (description) {
        form.description = description
        toast.success(t('admin.productsNew.description.generated'))
      }
    } catch (e: any) {
      toast.error(e.statusMessage || t('admin.productsNew.description.error'))
    } finally {
      generatingDesc.value = false
    }
  }

  async function generateImage() {
    if (!form.name) {
      toast.error(t('admin.productsNew.image.enterName'))
      return
    }
    generatingImage.value = true
    try {
    const { imageUrl } = await $fetch<{ imageUrl?: string }>('/api/ai/generate-image', {
      method: 'POST',
      body: { 
        prompt: form.name + (form.description ? ' ' + form.description.substring(0, 50) : '')
      }
    })
    if (imageUrl) {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const file = new File([blob], "ai-generated.jpg", { type: "image/jpeg" })
      uploadImage(file)
      toast.success(t('admin.productsNew.image.generated'))
    }
  } catch (e: any) {
    toast.error(e.statusMessage || t('admin.productsNew.image.error'))
  } finally {
    generatingImage.value = false
  }
}

async function save() {
  if (!isValid.value) return
  for (const o of options.value) {
    const type = o?.type || 'text'
    const baseVals = Array.isArray(o?.values)
      ? o.values.map((s: any) => String(s)).filter((s: string) => !!s)
      : String(o?.values || '').split(',').map((s: string) => s.trim()).filter(Boolean)
    if (['select', 'multiselect', 'color'].includes(type) && baseVals.length === 0) {
      toast.error(t('admin.productForm.optionSelectValuesRequired'))
      return
    }
  }
  const storeId = admin.selectedShopId
  if (!storeId) return navigateTo('/admin/stores/create')
  saving.value = true
  let createdProductId: string | null = null
  try {
    const hashTags = Array.from(new Set((String(form.description||'').match(/#([A-Za-z0-9_-]+)/g)||[]).map((h:string)=>h.slice(1).toLowerCase())))
    const existingNames = new Set((Array.isArray(tags.value)?tags.value:[]).map((t:any)=>String(t.name||'').toLowerCase()))
    const toCreate = hashTags.filter(n => !existingNames.has(n))
    const createdTagIds: number[] = []
    for (const name of toCreate) {
      const { data: r } = await supabase.from('tags').insert({ store_id: storeId, name }).select('id').maybeSingle()
      if (r?.id) { createdTagIds.push(Number(r.id)); tags.value.push({ id: r.id, name }) }
    }
    for (const id of createdTagIds) selectedTags.add(Number(id))

    // Process main images: prepare initial payload
    // Filter out blob URLs from form.images for the initial insert
    const initialImages = form.images.filter((img: string) => !pendingUploads.value.has(img))
    
    const price = Number(form.price || 0)
    const originalPrice = Number(form.original_price || 0)
    const stock = Number(form.stock_quantity || 0)
    const maxQty = Number(form.max_order_qty || 0)
    const minQty = Number(form.min_order_qty || 0)
    const costPerItem = Number(form.cost_per_item || 0)
    const payload = {
      store_id: storeId,
      name: form.name,
      price: Number.isFinite(price) && price > 0 ? price : 0,
      original_price: Number.isFinite(originalPrice) && originalPrice >= 0 ? originalPrice : 0,
      type: form.type,
      sku: form.sku,
      description: form.description,
      images: initialImages,
      track_inventory: form.track_inventory,
      stock_quantity: form.track_inventory && Number.isFinite(stock) && stock >= 0 ? stock : 0,
      is_visible: form.is_visible,
      is_out_of_stock: form.is_out_of_stock,
      daily_capacity: form.daily_capacity,
      max_order_quantity: Number.isFinite(maxQty) && maxQty > 0 ? maxQty : 0,
      min_order_quantity: Number.isFinite(minQty) && minQty > 0 ? minQty : 0,
      tax_exempt: form.tax_exempt,
      tax_exempt_reason: form.tax_exempt_reason || null,
      show_estimated_price: form.show_estimated_price,
      track_cost: form.track_cost,
      cost_price: form.track_cost && Number.isFinite(costPerItem) && costPerItem > 0 ? costPerItem : null,
      show_net_price: form.show_net_price,
      // weight: form.weight || null,
      category_id: form.category_id,
      unit: unit.value,
      unit_value: (() => {
        const unitValNum = Number(unitValue.value || 0)
        return Number.isFinite(unitValNum) && unitValNum > 0 ? unitValNum : null
      })(),
      requires_shipping: requiresShipping.value,
      delivery_methods: Array.from(deliveryMethods)
    }
    const { data, error: insertError } = await supabase.from('products').insert(payload).select('id').maybeSingle()
    if (insertError) {
      console.error('Insert Error:', insertError)
      throw new Error(insertError.message)
    }
    if (!data?.id) {
      console.error('No ID returned from insert')
      throw new Error('No ID returned from insert')
    }
    const pid = String(data.id)
    createdProductId = pid

    // Now upload pending images using the pid
    const newImagesList = []
    let hasNewUploads = false
    for (const img of form.images) {
      if (pendingUploads.value.has(img)) {
        const file = pendingUploads.value.get(img)!
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        // Use pid in path
        const path = `stores/${storeId}/products/${pid}/${Date.now()}-${sanitizedName}`
        const publicUrl = await uploadFileToStorage(file, path)
        newImagesList.push(publicUrl)
        URL.revokeObjectURL(img)
        hasNewUploads = true
      } else {
        newImagesList.push(img)
      }
    }

    if (hasNewUploads) {
      await supabase.from('products').update({ images: newImagesList }).eq('id', pid)
      form.images = newImagesList
    }

    // Process variant images using pid
    for (const v of variants.value) {
      if (v._pendingFile) {
        const file = v._pendingFile
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `stores/${storeId}/products/${pid}/variants/${Date.now()}-${sanitizedName}`
        const publicUrl = await uploadFileToStorage(file, path)
        if (v.image_url && v.image_url.startsWith('blob:')) {
            URL.revokeObjectURL(v.image_url)
        }
        v.image_url = publicUrl
        delete v._pendingFile
      }
    }

    // Ensure created tags exist and associate them
    const tagIds: number[] = []
    for (const t of tags.value) {
      if (t._new) {
        const { data: r } = await supabase.from('tags').insert({ store_id: storeId, name: t.name }).select('id').maybeSingle()
        if (r?.id) tagIds.push(Number(r.id))
      } else if (t.id) tagIds.push(Number(t.id))
    }
    for (const tid of Array.from(selectedTags)) {
      if (tagIds.includes(tid) && pid) await supabase.from('product_tags').insert({ product_id: Number(pid), tag_id: tid })
    }
    for (const v of variants.value) {
      const name = String(v.name || '').trim()
      if (!name) continue
      const vPrice = Number(v.price || 0)
      const vOriginal = Number(v.original_price || 0)
      await supabase.from('variants').insert({
        product_id: Number(pid),
        name,
        price: Number.isFinite(vPrice) && vPrice >= 0 ? vPrice : 0,
        original_price: Number.isFinite(vOriginal) && vOriginal >= 0 ? vOriginal : 0,
        image_url: v.image_url || null
      })
    }
    for (const o of options.value) {
      const name = String(o.name || '').trim()
      const base = Array.isArray(o.values)
        ? o.values.map((s: any) => String(s)).filter((s: string) => !!s)
        : String(o.values || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      const arr = base
      const limited = arr.slice(0, 10)
      if (arr.length > 10) {
        toast.error(t('admin.productsNew.options.valuesMax10'))
      }
      if (!name && limited.length === 0) continue
      await supabase.from('options').insert({
        product_id: Number(pid),
        name,
        type: o.type || 'text',
        values: limited.length ? limited : null,
        is_required: !!o.is_required
      })
    }
    toast.success(t('admin.productsNew.toast.productCreated'))
    setTimeout(() => navigateTo(`/admin/products/${pid}`), 600)
  } catch (e: any) {
    console.error('Error saving product:', e)
    if (createdProductId) {
      try {
        await supabase.from('options').delete().eq('product_id', Number(createdProductId))
        await supabase.from('variants').delete().eq('product_id', Number(createdProductId))
        await supabase.from('product_tags').delete().eq('product_id', Number(createdProductId))
        await supabase.from('products').delete().eq('id', createdProductId)
      } catch (cleanupError) {
        console.error('Error cleaning up failed product creation:', cleanupError)
      }
    }
    toast.error(t('admin.productsNew.toast.createError', { msg: e.message || '' }))
  } finally { saving.value = false }
}
async function submitGenerate() {
  if (!admin.selectedShopId) { toast.error(t('admin.productsNew.toast.selectStore')); return }
  if (admin.isFreePlan) { return navigateTo('/admin/settings?tab=billing') }
  const txt = String(generateText.value || '').trim()
  if (!txt) { toast.error(t('admin.productsNew.toast.enterText')); return }
  generatingProduct.value = true
  try {
    const r = await $fetch<{ id: string }>('/api/ai/generate-product', {
      method: 'POST',
      body: { storeId: admin.selectedShopId, text: txt }
    })
    if (r?.id) {
      toast.success(t('admin.productsNew.toast.success'))
      showGenerateModal.value = false
      generateText.value = ''
      setTimeout(() => navigateTo(`/admin/products/${r.id}`), 500)
    }
  } catch (e: any) {
    const msg = e?.statusMessage ? String(e.statusMessage) : t('admin.productsNew.toast.error')
    toast.error(msg)
  } finally {
    generatingProduct.value = false
  }
}
async function loadFilters() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const { data: c } = await supabase.from('categories').select('id,name').eq('store_id', storeId)
  categories.value = Array.isArray(c) ? c : []
  const { data: tg } = await supabase.from('tags').select('id,name').eq('store_id', storeId)
  tags.value = Array.isArray(tg) ? tg : []
}
onMounted(async () => {
  if (!admin.selectedShopId) {
    const { data } = await supabase.auth.getUser()
    const uid = data?.user?.id
    if (!uid) return navigateTo('/auth/login')
    const { data: ent } = await supabase.from('enterprises').select('id').eq('owner_id', uid).maybeSingle()
    const enterprise_id = ent?.id
    if (!enterprise_id) return navigateTo('/admin/stores/create')
    const { data: s } = await supabase.from('stores').select('id').eq('enterprise_id', enterprise_id).limit(1)
    const sid = Array.isArray(s) && s[0]?.id ? String(s[0].id) : ''
    if (sid) admin.selectShop(sid)
  }
  await loadFilters()
  if (admin.selectedShopId) {
    const { data: sone } = await supabase.from('stores').select('name,phone').eq('id', admin.selectedShopId).maybeSingle()
    storePhone.value = String(sone?.phone || '')
    storeName.value = String(sone?.name || '')
  }
  await admin.fetchSubscription(supabase)
})

onUnmounted(() => {
  form.images.forEach((url: string) => {
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
  })
  variants.value.forEach((v: any) => {
    if (v.image_url && v.image_url.startsWith('blob:')) URL.revokeObjectURL(v.image_url)
  })
})
useHead({ title: 'Admin | Ajouter un produit' })
</script>
