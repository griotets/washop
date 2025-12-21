<template>
  <div class="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-6rem)]">
    <!-- Sidebar Menu -->
    <aside class="w-full md:w-64 shrink-0 space-y-8">
      <div class="px-3 md:px-0">
         <NuxtLink to="/admin/dashboard" class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
           <ArrowLeft class="h-4 w-4" />
           <span>{{ t('admin.settings.backToDashboard') }}</span>
         </NuxtLink>
      </div>

       <div v-for="(section, idx) in menu" :key="idx">
         <h3 v-if="section.title" class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{{ section.title }}</h3>
         <div class="space-y-1">
           <button 
             v-for="item in section.items" 
             :key="item.id"
             @click="activeTab = item.id"
             class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
             :class="activeTab === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
           >
             <span>{{ item.label }}</span>
             <span v-if="item.badge" class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 border border-gray-200">{{ item.badge }}</span>
           </button>
         </div>
       </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 bg-white rounded-xl border shadow-sm p-6 md:p-8">
      <!-- General Settings -->
      <div v-if="activeTab === 'general'">
        <h2 class="text-xl font-bold mb-6">{{ t('admin.settings.generalStoreTitle') }}</h2>
        
        <div class="space-y-10">
          <!-- Profil Section -->
          <section class="space-y-6">
            <h3 class="font-semibold text-lg border-b pb-2">{{ t('admin.settings.profileTitle') }}</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.nameLabel') }}</label>
              <input v-model="form.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.descriptionLabel') }}</label>
              <textarea v-model="form.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"></textarea>
              <p class="mt-1 text-xs text-gray-500">{{ t('admin.settings.descriptionHint') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Devise</label>
              <select v-model="form.currency" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                <option value="XAF">XAF (FCFA)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.storeLinkLabel') }}</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">{{ domain }} /</span>
                <input v-model="form.slug" type="text" class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
              </div>
              <p class="mt-1 text-xs text-gray-500">{{ t('admin.settings.storeLinkHint') }}</p>
            </div>

            <div>
               <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.emailLabel') }}</label>
               <input v-model="form.email" type="email" :placeholder="t('admin.settings.emailPlaceholder')" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
               <p class="mt-1 text-xs text-gray-500">{{ t('admin.settings.emailHint') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.addressLabel') }}</label>
              <div class="mt-1">
                 <input v-model="form.address" :placeholder="t('admin.settings.addressPlaceholder')" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
              </div>
            </div>
          </section>

          <!-- WhatsApp Section -->
          <section class="space-y-6">
             <h3 class="font-semibold text-lg border-b pb-2">{{ t('admin.settings.whatsAppTitle') }}</h3>
             <p class="text-sm text-gray-500">{{ t('admin.settings.whatsAppSubtitle') }}</p>
             
             <div>
               <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.primaryNumberLabel') }}</label>
               <div class="mt-1 flex gap-2">
                 <select v-model="form.phoneCode" class="w-24 rounded-md border-gray-300 border p-2 bg-white">
                   <option value="+237">+237</option>
                   <option value="+33">+33</option>
                   <option value="+1">+1</option>
                   <option value="+241">+241</option>
                   <option value="+225">+225</option>
                   <option value="+221">+221</option>
                 </select>
                <input v-model="form.phoneNumber" type="tel" :placeholder="t('admin.settings.phonePlaceholder')" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
               </div>
             </div>
          </section>

          <!-- Regional Section -->
          <section class="space-y-6">
             <div class="flex items-center gap-2 border-b pb-2">
               <h3 class="font-semibold text-lg">{{ t('admin.settings.regionalTitle') }}</h3>
               <div class="rounded-full border border-gray-300 w-4 h-4 flex items-center justify-center text-[10px] text-gray-500 cursor-help" :title="t('admin.settings.regionalTooltip')">?</div>
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700">Pays/Région</label>
               <select v-model="form.country" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="Cameroon">Cameroon</option>
                 <option value="France">France</option>
                 <option value="Gabon">Gabon</option>
                 <option value="Ivory Coast">Ivory Coast</option>
                 <option value="Senegal">Senegal</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.languageLabel') }}</label>
               <p class="text-xs text-gray-500 mb-1">{{ t('admin.settings.languageHint') }}</p>
               <select v-model="form.language" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="fr">{{ t('admin.settings.languageDefault') }}</option>
                 <option value="en">English</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Monnaie</label>
               <select v-model="form.currency" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="XAF">XAF</option>
                 <option value="EUR">EUR</option>
                 <option value="USD">USD</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Unité de distance</label>
               <select v-model="form.distanceUnit" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="km">Kilomètre</option>
                 <option value="mi">Mile</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur de carte</label>
               <div class="space-y-2">
                 <div class="flex items-center">
                   <input id="map-osm" name="map-provider" type="radio" value="osm" v-model="form.mapProvider" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="map-osm" class="ml-3 block text-sm font-medium text-gray-700">OpenStreetMap</label>
                 </div>
                 <div class="flex items-center" :class="{ 'opacity-50 cursor-not-allowed': isFreePlan }">
                   <input id="map-google" name="map-provider" type="radio" value="google" :disabled="isFreePlan" v-model="form.mapProvider" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="map-google" class="ml-3 block text-sm font-medium text-gray-700">Google</label>
                 </div>
               </div>
               
                 <div v-if="isFreePlan" class="mt-2 rounded-md bg-green-50 p-2 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="text-green-500">⚡</div>
                    <span class="text-sm text-green-700 font-medium">{{ t('admin.settings.upgradeNeededBusiness') }}</span>
                  </div>
                  <button class="text-sm font-semibold text-gray-900 bg-white px-3 py-1 rounded border shadow-sm hover:bg-gray-50">{{ t('admin.upgrade') }}</button>
                </div>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Taux d'imposition</label>
               <div class="mt-1 flex rounded-md shadow-sm">
                 <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">%</span>
                 <input v-model="form.taxRate" type="number" step="0.01" class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
               </div>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Méthode fiscale</label>
               <div class="space-y-2">
                 <div class="flex items-center">
                   <input id="tax-inclusive" name="tax-method" type="radio" :value="true" v-model="form.taxInclusive" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="tax-inclusive" class="ml-3 block text-sm font-medium text-gray-700">Inclusif</label>
                 </div>
                 <div class="flex items-center">
                   <input id="tax-exclusive" name="tax-method" type="radio" :value="false" v-model="form.taxInclusive" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="tax-exclusive" class="ml-3 block text-sm font-medium text-gray-700">Exclusif</label>
                 </div>
               </div>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">ID de l'étiquette</label>
               <input v-model="form.taxId" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>
          </section>

          <!-- Opening Hours -->
          <section class="rounded-lg border border-gray-200 bg-white p-4">
             <div class="flex items-center justify-between">
               <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900">{{ t('admin.settings.openingHoursTitle') }}</h3>
                  <div class="rounded-full border border-gray-300 w-4 h-4 flex items-center justify-center text-[10px] text-gray-500 cursor-help" :title="t('admin.settings.openingHoursTooltip')">?</div>
               </div>
               <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle-hours" v-model="form.openingHoursEnabled" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label for="toggle-hours" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
               </div>
             </div>
             <p class="mt-1 text-sm text-gray-500">{{ t('admin.settings.openingHoursHint') }}</p>
          </section>

          <!-- Communities -->
          <section class="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
             <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900">{{ t('admin.settings.communitiesTitle') }}</h3>
                <div class="rounded-full border border-gray-300 w-4 h-4 flex items-center justify-center text-[10px] text-gray-500 cursor-help" :title="t('admin.settings.communitiesTooltip')">?</div>
             </div>
             <p class="text-sm text-gray-500">{{ t('admin.settings.communitiesHint') }}</p>
             
             <div>
               <label class="block text-sm font-medium text-gray-700">WhatsApp</label>
               <p class="text-xs text-gray-500 mb-1">{{ t('admin.settings.communitiesWhatsAppHint') }}</p>
               <input v-model="form.socialWhatsapp" :placeholder="t('common.urlPlaceholder')" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">{{ t('admin.settings.telegramLabel') }}</label>
               <p class="text-xs text-gray-500 mb-1">{{ t('admin.settings.communitiesTelegramHint') }}</p>
               <input v-model="form.socialTelegram" :placeholder="t('common.urlPlaceholder')" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Instagram</label>
               <p class="text-xs text-gray-500 mb-1">{{ t('admin.settings.communitiesInstagramHint') }}</p>
               <input v-model="form.socialInstagram" :placeholder="t('common.urlPlaceholder')" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Facebook</label>
               <p class="text-xs text-gray-500 mb-1">{{ t('admin.settings.communitiesFacebookHint') }}</p>
               <input v-model="form.socialFacebook" :placeholder="t('common.urlPlaceholder')" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>
          </section>

          <!-- Danger Zone -->
          <section class="rounded-lg border border-red-200 bg-white p-4 mt-8">
             <h3 class="font-semibold text-gray-900 mb-4">Zone de danger</h3>
             
             <div class="space-y-6">
                <!-- Disable Checkout -->
                <div class="flex items-start justify-between">
                   <div>
                      <h4 class="text-sm font-medium text-gray-900">Désactiver la caisse</h4>
                      <p class="text-sm text-gray-500">Les points d'entrée de la caisse seront désactivés et les clients ne pourront plus passer de commandes.</p>
                   </div>
                   <!-- Toggle -->
                   <div class="relative inline-block w-12 ml-4 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                      <input type="checkbox" name="toggle-checkout" id="toggle-checkout" v-model="disableCheckoutComputed" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                      <label for="toggle-checkout" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                   </div>
                </div>

                <!-- Disable Store -->
                <div class="flex items-start justify-between">
                   <div>
                      <h4 class="text-sm font-medium text-gray-900">Désactiver le magasin</h4>
                      <p class="text-sm text-gray-500">Les magasins seront désactivés et tous les visiteurs seront redirigés vers WhatsApp.</p>
                   </div>
                   <!-- Toggle -->
                   <div class="relative inline-block w-12 ml-4 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                      <input type="checkbox" name="toggle-store" id="toggle-store" v-model="disableStoreComputed" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                      <label for="toggle-store" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                   </div>
                </div>

                <!-- Business Banner -->
                <div v-if="isFreePlan" class="bg-green-50 border-l-4 border-green-400 p-4 flex items-center justify-between">
                   <div class="flex items-center">
                      <div class="flex-shrink-0">
                         <!-- Lightning Icon -->
                         <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                         </svg>
                      </div>
                      <div class="ml-3">
                         <p class="text-sm text-green-700">
                            Mise à niveau nécessaire pour utiliser Business
                         </p>
                      </div>
                   </div>
                   <button class="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium border border-green-200 hover:bg-green-50">
                      Mise à niveau
                   </button>
                </div>

                <!-- Delete Store -->
                <div class="pt-6 border-t border-gray-200">
                   <h4 class="text-sm font-medium text-gray-900 mb-2">Supprimer le magasin</h4>
                   <p class="text-sm text-gray-500 mb-2">Entrez <span class="font-mono bg-gray-100 px-1 rounded">{{ form.slug }}</span> pour confirmer la suppression</p>
                   
                   <input v-model="deleteConfirmation" type="text" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2 mb-4" />
                   
                   <button :disabled="deleteConfirmation !== form.slug" class="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4">
                      Supprimer le magasin
                   </button>

                   <div class="rounded-md bg-red-50 p-4">
                      <div class="flex">
                         <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                               <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                         </div>
                         <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">Danger</h3>
                            <div class="mt-2 text-sm text-red-700">
                               <p>Les commandes, les produits, les clients et tous les autres paramètres liés au magasin seront définitivement supprimés.</p>
                               <a href="#" class="font-medium underline hover:text-red-600 mt-1 inline-block">Voir plus</a>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
 
        <div class="mt-8 pt-6 border-t flex justify-end sticky bottom-0 bg-white py-4">
           <button @click="save" :disabled="saving" class="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
             <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
             <span>{{ saving ? t('common.saving') : t('common.save') }}</span>
           </button>
        </div>
      </div>
      
      <!-- Delivery Tab -->
      <div v-else-if="activeTab === 'delivery'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
             <h3 class="text-lg font-medium text-gray-900 mb-4">Méthodes de livraison</h3>
             <p class="text-sm text-gray-500 mb-6">Configurez comment vos clients reçoivent leurs commandes.</p>
             
             <div class="space-y-4">
                 <!-- Pickup -->
                 <div class="flex items-start justify-between border rounded-lg p-4">
                     <div class="flex items-start gap-3">
                         <div class="mt-1">
                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                         </div>
                         <div>
                             <h4 class="font-medium text-gray-900">Retrait en magasin</h4>
                             <p class="text-sm text-gray-500">Les clients viennent chercher leur commande.</p>
                         </div>
                     </div>
                     <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                        <input type="checkbox" v-model="deliveryForm.pickupEnabled" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label @click="deliveryForm.pickupEnabled = !deliveryForm.pickupEnabled" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" :class="{'bg-green-500': deliveryForm.pickupEnabled}"></label>
                     </div>
                 </div>

                 <!-- Delivery -->
                 <div class="flex items-start justify-between border rounded-lg p-4">
                     <div class="flex items-start gap-3">
                         <div class="mt-1">
                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                         </div>
                         <div>
                             <h4 class="font-medium text-gray-900">Livraison à domicile</h4>
                             <p class="text-sm text-gray-500">Vous livrez les commandes aux clients.</p>
                         </div>
                     </div>
                     <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                        <input type="checkbox" v-model="deliveryForm.deliveryEnabled" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label @click="deliveryForm.deliveryEnabled = !deliveryForm.deliveryEnabled" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" :class="{'bg-green-500': deliveryForm.deliveryEnabled}"></label>
                     </div>
                 </div>
             </div>
             
             <!-- Delivery Details -->
             <div v-if="deliveryForm.deliveryEnabled" class="mt-6 space-y-4 border-t pt-6">
                 <h4 class="font-medium text-gray-900">Options de livraison</h4>
                 
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Frais de livraison ({{ form.currency }})</label>
                    <input v-model="deliveryForm.deliveryFee" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
                 </div>
                 
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Livraison gratuite à partir de ({{ form.currency }})</label>
                    <input v-model="deliveryForm.freeDeliveryThreshold" type="number" placeholder="Laisser vide si jamais gratuit" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
                 </div>

                 <div>
                    <label class="block text-sm font-medium text-gray-700">Note de livraison</label>
                    <textarea v-model="deliveryForm.deliveryNote" rows="2" placeholder="Ex: Livraison sous 24h..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"></textarea>
                 </div>
             </div>
          </div>
          
          <div class="flex justify-end sticky bottom-0 bg-white py-4 border-t">
           <button @click="saveDelivery" :disabled="saving" class="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
             <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
               <span>{{ saving ? t('common.saving') : t('common.save') }}</span>
           </button>
          </div>
      </div>
      
      <!-- Enterprise Details Tab -->
      <div v-else-if="activeTab === 'details'" class="space-y-8">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Coordonnées de l'organisation</h3>
              <p class="text-sm text-gray-500 mb-6">Identifiant de l'organisation : {{ enterpriseId }}</p>
              
              <div class="space-y-6">
                 <div>
                   <label class="block text-sm font-medium text-gray-700">Nom</label>
                   <input v-model="enterpriseForm.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
                 </div>
                 
                 <div>
                   <label class="block text-sm font-medium text-gray-700">Quel type d'entreprise dirigez-vous ?</label>
                   <select v-model="enterpriseForm.industry" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                     <option value="">Sélectionner...</option>
                     <option value="Restauration & Gastronomie">Restauration & Gastronomie</option>
                     <option value="Vêtements & Accessoires">Vêtements & Accessoires</option>
                     <option value="Santé & Beauté">Santé & Beauté</option>
                     <option value="Électronique">Électronique</option>
                     <option value="Services">Services</option>
                     <option value="Autre">Autre</option>
                   </select>
                 </div>
                 
                 <div>
                   <label class="block text-sm font-medium text-gray-700">Nombre d'employés</label>
                   <select v-model="enterpriseForm.employeeCount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                     <option value=""># employés</option>
                     <option value="1-5">1-5</option>
                     <option value="6-20">6-20</option>
                     <option value="21-50">21-50</option>
                     <option value="50+">50+</option>
                   </select>
                 </div>
                 
                 <div>
                   <label class="block text-sm font-medium text-gray-700">Fuseau horaire</label>
                   <select v-model="enterpriseForm.timezone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                     <option value="Africa/Douala">GMT+01:00 West Central Africa</option>
                     <option value="Europe/Paris">GMT+01:00 Central European Standard Time</option>
                     <option value="UTC">UTC</option>
                   </select>
                 </div>
              </div>
          </div>
          
          <!-- Danger Zone -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
             <h3 class="font-semibold text-gray-900 mb-4">Zone de danger</h3>
             
             <div class="space-y-4">
                 <h4 class="text-sm font-medium text-gray-900">Entrez "DELETE" pour supprimer cette entreprise</h4>
                 <p class="text-sm text-gray-500">La suppression de l'entreprise n'est autorisée que lorsque vous n'avez pas de magasins et que vous êtes sur Basic plan.</p>
                 
                 <input v-model="deleteEnterpriseConfirmation" type="text" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2" />
                 
                 <button @click="deleteEnterprise" :disabled="deleteEnterpriseConfirmation !== 'DELETE'" class="w-full bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Supprimer l'organisation
                 </button>
                 
                 <div class="rounded-md bg-red-50 p-4">
                    <h3 class="text-sm font-medium text-red-800 mb-2">Danger</h3>
                    <p class="text-sm text-red-700">Tous les actifs de l'organisation, y compris les magasins, les commandes, les produits, les clients et les paramètres, seront définitivement supprimés.</p>
                 </div>
             </div>
          </div>
          
          <div class="flex justify-end sticky bottom-0 bg-white py-4 border-t mt-8">
           <button @click="saveEnterprise" :disabled="saving" class="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
             <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
               <span>{{ saving ? t('common.saving') : t('common.save') }}</span>
           </button>
          </div>
      </div>

      <!-- Billing Tab -->
      <div v-else-if="activeTab === 'billing'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Aperçu de l'abonnement</h3>
              <div class="flex items-center justify-between mb-6">
                  <div>
                      <p class="text-sm text-gray-500">Plan actuel</p>
                      <div class="flex items-center gap-2 mt-1">
                          <span class="text-2xl font-bold text-gray-900 capitalize">{{ subscription?.plan?.name || 'Gratuit' }}</span>
                          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium" :class="subscription?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                              {{ subscription?.status === 'active' ? 'Actif' : (subscription?.status || 'Inactif') }}
                          </span>
                      </div>
                  </div>
                  <div class="text-right">
                      <p class="text-sm text-gray-500">Prochain renouvellement</p>
                      <p class="font-medium text-gray-900">{{ subscription?.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A' }}</p>
                  </div>
              </div>
              
              <!-- Usage -->
              <div>
                  <div class="flex justify-between text-sm mb-1">
                      <span class="font-medium text-gray-700">Utilisation des produits</span>
                      <span class="text-gray-500">{{ productCount }} / {{ subscription?.plan?.max_products || 'Illimité' }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: Math.min((productCount / (subscription?.plan?.max_products || 100)) * 100, 100) + '%' }"></div>
                  </div>
              </div>
          </div>

          <!-- Plans Grid -->
          <div class="grid md:grid-cols-3 gap-6">
              <div v-for="plan in plans" :key="plan.id" class="border rounded-lg p-6 relative flex flex-col" :class="{'border-green-500 ring-1 ring-green-500': subscription?.plan_id === plan.id, 'bg-white': true}">
                  <div v-if="subscription?.plan_id === plan.id" class="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                      {{ t('admin.settings.current') }}
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ plan.name }}</h4>
                  <div class="mt-2 flex items-baseline text-gray-900">
                      <span class="text-3xl font-bold tracking-tight">{{ plan.price.toLocaleString() }}</span>
                      <span class="ml-1 text-sm font-semibold text-gray-500">{{ t('admin.settings.pricePerMonth') }}</span>
                  </div>
                  <p class="mt-4 text-sm text-gray-500 flex-grow">
                     {{ planDescription(plan.id) }}
                  </p>
                  
                  <ul class="mt-6 space-y-4 mb-8">
                      <li v-for="feature in plan.features" :key="feature" class="flex text-sm text-gray-700">
                          <svg class="h-5 w-5 text-green-500 shrink-0 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          {{ formatFeature(feature) }}
                      </li>
                  </ul>

                  <button :disabled="subscription?.plan_id === plan.id" class="w-full mt-auto bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                      {{ subscription?.plan_id === plan.id ? t('admin.settings.currentPlan') : t('admin.settings.choosePlan') }}
                  </button>
              </div>
          </div>
      </div>
      
      <!-- Placeholder for other tabs -->
       <div v-else class="flex flex-col items-center justify-center h-96 text-center">
          <div v-if="['payments', 'checkout', 'delivery'].includes(activeTab)" class="flex flex-col items-center">
             <div class="p-4 bg-gray-100 rounded-full mb-4">
               <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
             </div>
             <h3 class="text-lg font-medium text-gray-900">{{ t('admin.settings.comingSoon') }}</h3>
             <p class="mt-2 text-sm text-gray-500 max-w-sm">{{ t('admin.settings.moduleInProgress', { module: menu.flatMap(g => g.items).find(i => i.id === activeTab)?.label }) }}</p>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12">
             <AdminPremiumLock 
               :title="t('admin.settings.premiumTitle')"
               :description="t('admin.settings.premiumDesc')"
             />
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
import { ArrowLeft, Lock, Loader2 } from 'lucide-vue-next'

const { t } = useI18n()

useHead({ title: t('admin.settings.headTitle') })
definePageMeta({ layout: 'admin' })

const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const saving = ref(false)
const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab ? String(route.query.tab) : 'general')
const url = useRequestURL()
const domain = url.host

// Sync tab with URL
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string') {
    activeTab.value = newTab
  }
})

// Update URL when tab changes
watch(activeTab, (newTab) => {
  router.push({ query: { ...route.query, tab: newTab } })
})

const menu = computed(() => [
  {
    title: t('admin.settings.menuStoresTitle'),
    items: [
      { id: 'general', label: t('admin.settings.menuGeneral') },
      { id: 'delivery', label: t('admin.settings.menuDelivery') },
      { id: 'payments', label: t('admin.settings.menuPayments'), badge: t('admin.settings.badgeSoon') },
      { id: 'checkout', label: t('admin.settings.menuCheckout'), badge: t('admin.settings.badgeSoon') }
    ]
  },
  {
    title: t('admin.settings.menuEnterpriseTitle'),
    items: [
      { id: 'details', label: t('admin.settings.menuDetails') },
      { id: 'billing', label: t('admin.settings.menuBilling') },
      { id: 'members', label: t('admin.settings.menuMembers'), badge: t('admin.settings.badgePremium') }
    ]
  }
])

const form = reactive({
  name: '',
  description: '',
  currency: 'XAF',
  slug: '',
  email: '',
  address: '',
  phoneCode: '+237',
  phoneNumber: '',
  country: 'Cameroon',
  language: 'fr',
  distanceUnit: 'km',
  mapProvider: 'osm',
  taxRate: 0,
  taxInclusive: true,
  taxId: '',
  openingHoursEnabled: false,
  socialWhatsapp: '',
  socialTelegram: '',
  socialInstagram: '',
  socialFacebook: '',
  checkoutEnabled: true,
  isActive: true
})

const enterpriseForm = reactive({
  name: '',
  industry: '',
  employeeCount: '',
  timezone: 'Africa/Douala'
})

const deliveryForm = reactive({
  pickupEnabled: true,
  deliveryEnabled: true,
  deliveryFee: 0,
  freeDeliveryThreshold: null as number | null,
  deliveryNote: ''
})

const originalSlug = ref('')
const deleteConfirmation = ref('')
const deleteEnterpriseConfirmation = ref('')

const enterpriseId = ref('')
const subscription = ref<any>(null)
const plans = ref<any[]>([])
const productCount = ref(0)

const isFreePlan = computed(() => {
  return !subscription.value || subscription.value.plan_id === 'free'
})

const disableCheckoutComputed = computed({
  get: () => !form.checkoutEnabled,
  set: (val) => { form.checkoutEnabled = !val }
})

const disableStoreComputed = computed({
  get: () => !form.isActive,
  set: (val) => { form.isActive = !val }
})

onMounted(async () => {
  if (!admin.selectedShopId) return
  const { data, error } = await supabase.from('stores').select('*').eq('id', admin.selectedShopId).maybeSingle()
  if (data) {
    form.name = data.name || ''
    form.description = data.description || ''
    form.currency = data.currency || 'XAF'
    form.slug = data.slug || ''
    originalSlug.value = data.slug || ''
    form.email = data.email || '' 
    form.address = data.address || ''
    form.country = data.country || 'Cameroon'
    form.language = data.language || 'fr'
    form.distanceUnit = data.distance_unit || 'km'
    form.mapProvider = data.map_provider || 'osm'
    form.taxRate = Number(data.tax_rate || 0)
    form.taxInclusive = data.tax_inclusive !== false // default true
    form.taxId = data.tax_id || ''
    form.openingHoursEnabled = data.opening_hours_enabled || false
    form.socialWhatsapp = data.social_whatsapp || ''
    form.socialTelegram = data.social_telegram || ''
    form.socialInstagram = data.social_instagram || ''
    form.socialFacebook = data.social_facebook || ''
    form.checkoutEnabled = data.checkout_enabled !== false
    form.isActive = data.is_active !== false
    
    if (data.enterprise_id) {
      enterpriseId.value = data.enterprise_id
      
      // Fetch enterprise details
      const { data: ent } = await supabase.from('enterprises').select('*').eq('id', data.enterprise_id).single()
      if (ent) {
        enterpriseForm.name = ent.name || ''
        enterpriseForm.industry = ent.industry || ''
        enterpriseForm.employeeCount = ent.employee_count || ''
        enterpriseForm.timezone = ent.timezone || 'Africa/Douala'
      }

      // Fetch subscription
      const { data: sub } = await supabase.from('subscriptions').select('*, plan:subscription_plans(*)').eq('enterprise_id', data.enterprise_id).maybeSingle()
      subscription.value = sub

      // Fetch plans
      const { data: allPlans } = await supabase.from('subscription_plans').select('*').order('price')
      plans.value = allPlans || []
      
      // Fetch product count
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', admin.selectedShopId)
      productCount.value = count || 0
    }

    // Load Delivery Settings
    if (data.delivery_settings) {
       const ds = data.delivery_settings
       deliveryForm.pickupEnabled = ds.pickup_enabled !== false
       deliveryForm.deliveryEnabled = ds.delivery_enabled !== false
       deliveryForm.deliveryFee = ds.delivery_fee || 0
       deliveryForm.freeDeliveryThreshold = ds.free_delivery_threshold
       deliveryForm.deliveryNote = ds.delivery_note || ''
    }

    // Parse phone
    if (data.phone) {
      // Simple parse, assume starts with +
      const match = data.phone.match(/^(\+\d+)(.+)$/)
      if (match) {
        form.phoneCode = match[1]
        form.phoneNumber = match[2].trim()
      } else {
        form.phoneNumber = data.phone
      }
    }
  }
})

async function save() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  
  saving.value = true
  const toast = useToast()
  
  try {
    const updates: any = {
      name: form.name,
      slug: form.slug,
      phone: form.phoneCode + form.phoneNumber.replace(/\s/g, '')
    }
    
    updates.description = form.description
    updates.currency = form.currency
    updates.email = form.email
    updates.address = form.address
    updates.country = form.country
    updates.language = form.language
    updates.distance_unit = form.distanceUnit
    updates.map_provider = form.mapProvider
    updates.tax_rate = form.taxRate
    updates.tax_inclusive = form.taxInclusive
    updates.tax_id = form.taxId
    updates.opening_hours_enabled = form.openingHoursEnabled
    updates.social_whatsapp = form.socialWhatsapp
    updates.social_telegram = form.socialTelegram
    updates.social_instagram = form.socialInstagram
    updates.social_facebook = form.socialFacebook
    updates.checkout_enabled = form.checkoutEnabled
    updates.is_active = form.isActive
    
    const { error } = await supabase.from('stores').update(updates).eq('id', storeId)
    
    if (error) {
       // Check for column error
       const msg = error.message
       if (msg.includes('column "email"') || msg.includes('column "address"') || msg.includes('column "description"') || msg.includes('column "currency"') || msg.includes('column "country"') || msg.includes('column "opening_hours_enabled"') || msg.includes('column "checkout_enabled"') || msg.includes('column "is_active"')) {
         // Naive retry: strip all optional fields
         delete updates.email
         delete updates.address
         delete updates.description
         delete updates.currency
         delete updates.country
         delete updates.language
         delete updates.distance_unit
         delete updates.map_provider
         delete updates.tax_rate
         delete updates.tax_inclusive
         delete updates.tax_id
         delete updates.opening_hours_enabled
         delete updates.social_whatsapp
         delete updates.social_telegram
         delete updates.social_instagram
         delete updates.social_facebook
         delete updates.checkout_enabled
         delete updates.is_active
         
         const { error: retryError } = await supabase.from('stores').update(updates).eq('id', storeId)
         if (retryError) throw retryError
         toast.success(t('admin.settings.basicSettingsUpdatedPartial'))
       } else {
         throw error
       }
    } else {
       toast.success(t('admin.settings.settingsUpdated'))
    }

    if (originalSlug.value !== form.slug) {
      // Slug changed, might need to redirect or warn
      originalSlug.value = form.slug
      toast.info(t('admin.settings.storeUrlChanged'))
    }
    
  } catch (e: any) {
    console.error(e)
    toast.error(t('admin.settings.errorWithMessage', { msg: e.message }))
  } finally {
    saving.value = false
  }
}

async function saveDelivery() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  
  saving.value = true
  const toast = useToast()
  
  try {
     const settings = {
        pickup_enabled: deliveryForm.pickupEnabled,
        delivery_enabled: deliveryForm.deliveryEnabled,
        delivery_fee: deliveryForm.deliveryFee,
        free_delivery_threshold: deliveryForm.freeDeliveryThreshold,
        delivery_note: deliveryForm.deliveryNote
     }
     
     const { error } = await supabase.from('stores').update({
        delivery_settings: settings
     }).eq('id', storeId)
     
     if (error) throw error
     toast.success(t('admin.settings.deliveryUpdated'))
  } catch (e: any) {
     console.error(e)
     toast.error(t('admin.settings.errorWithMessage', { msg: e.message }))
  } finally {
     saving.value = false
  }
}

async function saveEnterprise() {
  if (!enterpriseId.value) return
  saving.value = true
  const toast = useToast()

  try {
    const { error } = await supabase.from('enterprises').update({
      name: enterpriseForm.name,
      industry: enterpriseForm.industry,
      employee_count: enterpriseForm.employeeCount,
      timezone: enterpriseForm.timezone
    }).eq('id', enterpriseId.value)

    if (error) throw error
    toast.success(t('admin.settings.enterpriseUpdated'))
  } catch (e: any) {
    console.error(e)
    toast.error(t('admin.settings.errorWithMessage', { msg: e.message }))
  } finally {
    saving.value = false
  }
}

async function deleteEnterprise() {
  if (!enterpriseId.value || deleteEnterpriseConfirmation.value !== 'DELETE') return
  
  saving.value = true
  const toast = useToast()
  
  try {
     // Check store count
     const { count } = await supabase.from('stores').select('*', { count: 'exact', head: true }).eq('enterprise_id', enterpriseId.value)
     
     if (count && count > 0) {
        toast.error(t('admin.settings.deleteEnterpriseNeedsNoStores'))
        return
     }
     
     const { error } = await supabase.from('enterprises').delete().eq('id', enterpriseId.value)
     if (error) throw error
     
     toast.success(t('admin.settings.enterpriseDeleted'))
     navigateTo('/login')
  } catch (e: any) {
     toast.error(t('admin.settings.errorWithMessage', { msg: e.message }))
  } finally {
     saving.value = false
  }
}

const formatFeature = (key: string) => {
  if (key === 'commandes_whatsapp_illimitees') return t('admin.settings.feature.whatsAppOrdersUnlimited')
  if (key === 'sous_domaine') return t('admin.settings.feature.subDomain', { domain })
  if (key === 'produits_illimites') return t('admin.settings.feature.productsUnlimited')
  if (key === 'statistiques_avancees') return t('admin.settings.feature.advancedStats')
  if (key === 'promo_codes') return t('admin.settings.feature.promoCodes')
  if (key === 'crm_export') return t('admin.settings.feature.crmExport')
  if (key === 'support_prioritaire') return t('admin.settings.feature.prioritySupport')
  if (key === 'domaine_personnalise') return t('admin.settings.feature.customDomain')
  if (key === 'multi_magasins') return t('admin.settings.feature.multiStores')
  if (key === 'white_label') return t('admin.settings.feature.whiteLabel')
  return key.replace(/_/g, ' ')
}

function planDescription(planId: string) {
  if (planId === 'free') return t('admin.settings.planDesc.free')
  if (planId === 'premium') return t('admin.settings.planDesc.premium')
  return t('admin.settings.planDesc.business')
}
</script>
