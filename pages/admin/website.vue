<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Design</h1>
      <div class="flex items-center gap-3">
        <button class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" @click="saveConfig">Mettre à jour</button>
      </div>
    </div>

    <div class="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div class="flex items-center gap-6 border-b">
          <button :class="tab==='vitrine'?'border-b-2 border-green-600 font-semibold px-2 py-3':'px-2 py-3 text-gray-600'" @click="tab='vitrine'">Vitrine</button>
          <button :class="tab==='caisse'?'border-b-2 border-green-600 font-semibold px-2 py-3':'px-2 py-3 text-gray-600'" @click="tab='caisse'">Caisse</button>
          <button :class="tab==='apparence'?'border-b-2 border-green-600 font-semibold px-2 py-3':'px-2 py-3 text-gray-600'" @click="tab='apparence'">Apparence</button>
          <button :class="tab==='menu'?'border-b-2 border-green-600 font-semibold px-2 py-3':'px-2 py-3 text-gray-600'" @click="tab='menu'">Menu</button>
          <div class="ml-auto">
            <button class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" @click="addBlock">Ajouter une carte</button>
          </div>
        </div>

        <div v-if="tab==='vitrine'" class="mt-4 space-y-4">
          <div class="flex items-center gap-2">
            <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="addBlock('category')">Ajouter carte Catégorie</button>
            <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="addBlock('banner')">Ajouter Bannière</button>
            <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="addBlock('popup')">Ajouter Popup</button>
          </div>
          <div v-for="(b,i) in blocks" :key="b.id" class="rounded-2xl border bg-white p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <GripVertical class="h-5 w-5 text-gray-400" />
                <span v-if="b.type==='category'">Catégorie de produit</span>
                <span v-else-if="b.type==='banner'">Bannière</span>
                <span v-else>Popup</span>
              </div>
              <div class="flex items-center gap-2">
                <button class="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white" @click="b.visible=!b.visible"><Eye class="h-4 w-4" :class="b.visible?'text-gray-700':'text-gray-400'" /></button>
                <button class="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white" @click="removeBlock(i)"><Trash class="h-4 w-4 text-gray-700" /></button>
              </div>
            </div>
            <div v-if="b.type==='category'" class="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium">Catégorie</label>
                <select v-model="b.category_id" class="mt-1 w-full rounded-lg border px-3 py-2">
                  <option :value="null">—</option>
                  <option v-for="c in categories" :key="c.id" :value="Number(c.id)">{{ c.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium">Disposition</label>
                <div class="mt-1 flex items-center gap-2">
                  <button :class="b.layout==='list' ? 'rounded px-3 py-1 text-xs bg-green-600 text-white' : 'rounded px-3 py-1 text-xs border bg-white'" @click="b.layout='list'">Liste</button>
                  <button :class="b.layout==='grid' ? 'rounded px-3 py-1 text-xs bg-green-600 text-white' : 'rounded px-3 py-1 text-xs border bg-white'" @click="b.layout='grid'">Grille</button>
                </div>
              </div>
              <label class="mt-3 inline-flex items-center gap-2">
                <input type="checkbox" v-model="b.limit4" />
                <span class="text-sm">Présentez jusqu'à 4 produits</span>
              </label>
            </div>
            <div v-else-if="b.type==='banner'" class="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium">Texte</label>
                <input v-model.trim="b.text" :maxlength="45" class="mt-1 w-full rounded-lg border px-3 py-2" />
                <div class="mt-1 text-[11px] text-gray-600">{{ String(b.text||'').length }}/45 caractères</div>
              </div>
              <div>
                <label class="block text-sm font-medium">Lien</label>
                <input v-model.trim="b.link" placeholder="https://" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
            </div>
            <div v-else class="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium">Titre</label>
                <input v-model.trim="b.title" :maxlength="100" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium">Description</label>
                <input v-model.trim="b.description" :maxlength="100" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium">Lien</label>
                <input v-model.trim="b.link" placeholder="https://" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="tab==='caisse'" class="mt-4 rounded-2xl border bg-white p-6">
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <div class="text-sm font-semibold mb-2">Méthodes de paiement</div>
              <div class="space-y-2">
                <label class="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                  <span class="text-sm">Espèces</span>
                  <input type="checkbox" v-model="checkout.methods.cash" />
                </label>
                <label class="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                  <span class="text-sm">Mobile Money</span>
                  <input type="checkbox" v-model="checkout.methods.momo" />
                </label>
                <label class="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                  <span class="text-sm">Carte bancaire</span>
                  <input type="checkbox" v-model="checkout.methods.card" />
                </label>
              </div>
              <div class="mt-4 text-xs text-gray-600">Sélectionnez au moins une méthode.</div>
            </div>
            <div>
              <div class="text-sm font-semibold mb-2">Options</div>
              <div class="space-y-2">
                <label class="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                  <span class="text-sm">Exiger le téléphone</span>
                  <input type="checkbox" v-model="checkout.require_phone" />
                </label>
                <label class="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                  <span class="text-sm">Autoriser une note du client</span>
                  <input type="checkbox" v-model="checkout.allow_notes" />
                </label>
                <label class="grid gap-2 rounded-lg border bg-white px-3 py-2">
                  <span class="text-sm">Devise</span>
                  <select v-model="checkout.currency" class="rounded border px-2 py-1 text-sm">
                    <option value="FCFA">FCFA</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </label>
                <div class="grid gap-2 rounded-lg border bg-white px-3 py-2">
                  <span class="text-sm">Livraison</span>
                  <label class="flex items-center justify-between">
                    <span class="text-sm">Retrait en magasin</span>
                    <input type="checkbox" v-model="checkout.delivery.pickup" />
                  </label>
                  <label class="flex items-center justify-between">
                    <span class="text-sm">Livraison</span>
                    <input type="checkbox" v-model="checkout.delivery.delivery" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="tab==='apparence'" class="mt-4 rounded-2xl border bg-white p-6">
          <div class="grid gap-6 sm:grid-cols-2">
            <div class="space-y-6">
              <div>
                <div class="text-sm font-semibold mb-2">Profil</div>
                <label class="block text-xs text-gray-600">Nom</label>
                <input v-model.trim="appearance.profileName" class="mt-1 w-full rounded border px-3 py-2 text-sm" />
                <label class="mt-3 block text-xs text-gray-600">Description</label>
                <textarea v-model.trim="appearance.profileDescription" rows="3" class="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="Decorate with **bold**, ~strike~, _italic_"></textarea>
                <div class="mt-2 rounded border bg-white p-2 text-xs">
                  <div class="font-semibold mb-1">Aperçu</div>
                  <div v-html="profileDescHtml"></div>
                </div>
              </div>
              <div>
                <div class="text-sm font-semibold mb-2">Couleurs</div>
                <label class="block text-xs text-gray-600">Couleur primaire</label>
                <div class="flex items-center gap-2">
                  <input type="color" v-model="appearance.primary" class="h-10 w-14 rounded border" />
                  <input v-model="appearance.primary" class="flex-1 rounded border px-3 py-2 text-sm" />
                </div>
                <div class="mt-1 text-[11px] text-gray-600">Choisissez une couleur qui reflète votre marque. Elle sera utilisée pour les boutons et les mises en évidence.</div>
                <label class="mt-3 block text-xs text-gray-600">Couleur d’arrière plan</label>
                <div class="flex items-center gap-2">
                  <input type="color" v-model="appearance.background" class="h-10 w-14 rounded border" />
                  <input v-model="appearance.background" class="flex-1 rounded border px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <div class="text-sm font-semibold mb-2">Logo (URL)</div>
                <input v-model.trim="appearance.logoUrl" placeholder="https://exemple.com/logo.jpg" class="w-full rounded border px-3 py-2 text-sm" />
                <div class="mt-2">
                  <input type="file" accept="image/*" @change="onLogoFileChange" />
                </div>
              </div>
              <div>
                <div class="text-sm font-semibold mb-2">Préréglages de couleurs</div>
                <div class="flex flex-wrap gap-2">
                  <button v-for="c in presetColors" :key="c" class="h-8 w-8 rounded-full border" :style="{ backgroundColor: c }" @click="applyPreset(c)" />
                </div>
              </div>
              <div>
                <div class="text-sm font-semibold mb-2">Bannière</div>
                <label class="block text-xs text-gray-600">Texte</label>
                <input v-model.trim="appearance.bannerText" :maxlength="45" class="mt-1 w-full rounded border px-3 py-2 text-sm" />
                <div class="mt-1 text-[11px] text-gray-600">{{ bannerCount }}/45 caractères</div>
                <label class="mt-3 block text-xs text-gray-600">Lien</label>
                <input v-model.trim="appearance.bannerLink" placeholder="https://" class="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>
              <div>
                <div class="text-sm font-semibold mb-2">Popup</div>
                <div class="text-[11px] text-gray-600 mb-2">Affichée une fois lors de la première visite.</div>
                <label class="flex items-center gap-2 text-xs">
                  <span>Activer</span>
                  <input type="checkbox" v-model="appearance.popupEnabled" />
                </label>
                <label class="mt-3 block text-xs text-gray-600">Titre</label>
                <input v-model.trim="appearance.popupTitle" :maxlength="100" class="mt-1 w-full rounded border px-3 py-2 text-sm" />
                <div class="mt-1 text-[11px] text-gray-600">{{ popupTitleCount }}/100 caractères</div>
                <label class="mt-3 block text-xs text-gray-600">Description</label>
                <input v-model.trim="appearance.popupDescription" :maxlength="100" class="mt-1 w-full rounded border px-3 py-2 text-sm" />
                <div class="mt-1 text-[11px] text-gray-600">{{ popupDescCount }}/100 caractères</div>
                <label class="mt-3 block text-xs text-gray-600">Lien vers</label>
                <input v-model.trim="appearance.popupLink" placeholder="https://" class="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <div class="text-sm font-semibold mb-2">Aperçu</div>
              <div class="rounded-xl border bg-white p-3">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full overflow-hidden" :style="{ backgroundColor: appearance.primary }">
                    <img v-if="appearance.logoUrl" :src="appearance.logoUrl" class="h-full w-full object-cover" />
                  </div>
                  <div class="font-semibold text-sm">{{ appearance.profileName || storeName }}</div>
                </div>
                <div class="mt-3 text-xs text-gray-700" v-html="profileDescHtml"></div>
                <div v-if="appearance.bannerText" class="mt-3 rounded-lg px-3 py-2 text-xs" :style="{ backgroundColor: appearance.background }">
                  <a v-if="appearance.bannerLink" :href="appearance.bannerLink" target="_blank" class="font-semibold" :style="{ color: appearance.primary }">{{ appearance.bannerText }}</a>
                  <span v-else class="font-semibold" :style="{ color: appearance.primary }">{{ appearance.bannerText }}</span>
                </div>
                <div v-if="appearance.popupEnabled" class="mt-3 rounded-lg border bg-white p-3 text-xs">
                  <div class="font-semibold mb-1">{{ appearance.popupTitle || 'Offre de bienvenue spéciale' }}</div>
                  <div class="text-gray-700">{{ appearance.popupDescription || 'Bénéficiez de 20 % de réduction sur votre premier achat.' }}</div>
                  <div class="mt-2">
                    <a v-if="appearance.popupLink" :href="appearance.popupLink" target="_blank" class="rounded bg-gray-900 px-3 py-2 text-white">Découvrir</a>
                    <span v-else class="rounded border bg-white px-3 py-2">Aucun lien</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="tab==='menu'" class="mt-4 rounded-2xl border bg-white p-6">
          <div class="text-sm font-semibold mb-2">Éléments du menu</div>
          <div class="space-y-2">
            <div v-for="(item,i) in menuItems" :key="item.key" class="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <div class="flex-1 text-sm">{{ item.label }}</div>
              <label class="flex items-center gap-1 text-xs">
                <span>Visible</span>
                <input type="checkbox" v-model="item.visible" />
              </label>
              <button class="rounded border bg-white px-2 py-1 text-xs" @click="moveUp(i)" :disabled="i===0">↑</button>
              <button class="rounded border bg-white px-2 py-1 text-xs" @click="moveDown(i)" :disabled="i===menuItems.length-1">↓</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="rounded-3xl border bg-white p-3">
          <div class="mx-auto max-w-xs rounded-[2rem] border-4 border-black p-3">
            <div class="rounded-2xl bg-gray-100">
              <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 px-3 py-2 text-sm">
                <div class="font-semibold">{{ storeName }}</div>
                <div class="flex items-center gap-2">
                  <Menu class="h-4 w-4 text-gray-600" />
                  <ShoppingCart class="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div class="px-3 py-3" :style="{ backgroundColor: tab==='apparence' ? appearance.background : undefined }">
                <div v-if="tab==='vitrine'">
                  <div v-for="b in blocks.filter(x=>x.visible)" :key="b.id" class="mb-3 rounded-xl border bg-white p-3">
                    <template v-if="b.type==='category'">
                      <div class="text-sm font-semibold mb-2">{{ categoryName(b.category_id) || 'Produits' }}</div>
                      <div v-if="b.layout==='list'" class="space-y-2">
                        <div v-for="p in previewProducts(b)" :key="p.id" class="rounded border p-2">
                          <div class="font-medium text-sm">{{ p.name }}</div>
                          <div class="text-xs text-gray-600" :style="{ color: appearance.primary }">{{ checkout.currency }} {{ Number(p.price||0).toLocaleString('fr-FR') }}</div>
                        </div>
                      </div>
                      <div v-else class="grid grid-cols-2 gap-2">
                        <div v-for="p in previewProducts(b)" :key="p.id" class="rounded border p-2">
                          <div class="h-20 w-full rounded bg-gray-100 mb-2 overflow-hidden">
                            <img :src="firstImage(p)" class="h-full w-full object-cover" />
                          </div>
                          <div class="text-xs font-medium truncate">{{ p.name }}</div>
                          <div class="text-[11px]" :style="{ color: appearance.primary }">{{ checkout.currency }} {{ Number(p.price||0).toLocaleString('fr-FR') }}</div>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="b.type==='banner'">
                      <div class="text-sm font-semibold mb-2">Bannière</div>
                      <div class="rounded-lg px-3 py-2 text-xs" :style="{ backgroundColor: appearance.background }">
                        <a v-if="b.link" :href="b.link" target="_blank" class="font-semibold" :style="{ color: appearance.primary }">{{ b.text }}</a>
                        <span v-else class="font-semibold" :style="{ color: appearance.primary }">{{ b.text }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-sm font-semibold mb-2">Popup</div>
                      <div class="rounded-lg border bg-white p-3 text-xs">
                        <div class="font-semibold mb-1">{{ b.title || 'Titre de popup' }}</div>
                        <div class="text-gray-700">{{ b.description || 'Description de popup' }}</div>
                        <div class="mt-2">
                          <a v-if="b.link" :href="b.link" target="_blank" class="rounded bg-gray-900 px-3 py-2 text-white">Découvrir</a>
                          <span v-else class="rounded border bg-white px-3 py-2">Aucun lien</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div v-else-if="tab==='caisse'">
                  <div class="rounded-xl border bg-white p-3">
                    <div class="text-sm font-semibold mb-2">Panier</div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between rounded border px-2 py-2 text-sm">
                        <span>Article A</span>
                        <span>{{ checkout.currency }} {{ Number(3000).toLocaleString('fr-FR') }}</span>
                      </div>
                      <div class="flex items-center justify-between rounded border px-2 py-2 text-sm">
                        <span>Article B</span>
                        <span>{{ checkout.currency }} {{ Number(2500).toLocaleString('fr-FR') }}</span>
                      </div>
                    </div>
                    <div class="mt-3 flex items-center justify-between font-semibold text-sm">
                      <span>Total</span>
                      <span>{{ checkout.currency }} {{ Number(5500).toLocaleString('fr-FR') }}</span>
                    </div>
                  </div>
                  <div class="mt-3 rounded-xl border bg-white p-3">
                    <div class="text-sm font-semibold mb-2">Paiement</div>
                    <div class="grid grid-cols-2 gap-2">
                      <button :class="checkout.methods.cash?'rounded bg-gray-900 px-3 py-2 text-xs font-semibold text-white':'rounded border bg-white px-3 py-2 text-xs'" @click="checkout.methods.cash=!checkout.methods.cash">Espèces</button>
                      <button :class="checkout.methods.momo?'rounded bg-gray-900 px-3 py-2 text-xs font-semibold text-white':'rounded border bg-white px-3 py-2 text-xs'" @click="checkout.methods.momo=!checkout.methods.momo">Mobile Money</button>
                      <button :class="checkout.methods.card?'rounded bg-gray-900 px-3 py-2 text-xs font-semibold text-white':'rounded border bg-white px-3 py-2 text-xs'" @click="checkout.methods.card=!checkout.methods.card">Carte</button>
                    </div>
                    <div class="mt-3 grid gap-2">
                      <label class="flex items-center justify-between text-xs">
                        <span>Exiger le téléphone</span>
                        <input type="checkbox" v-model="checkout.require_phone" />
                      </label>
                      <label class="flex items-center justify-between text-xs">
                        <span>Exiger l’email</span>
                        <input type="checkbox" v-model="checkout.require_email" />
                      </label>
                      <label class="flex items-center justify-between text-xs">
                        <span>Autoriser une note</span>
                        <input type="checkbox" v-model="checkout.allow_notes" />
                      </label>
                    </div>
                    <div class="mt-3">
                      <div class="text-sm font-semibold mb-1">Message WhatsApp</div>
                      <textarea v-model="checkout.message_template" rows="3" class="w-full rounded border px-3 py-2 text-xs" placeholder="Bonjour {store}, je confirme ma commande de {items} pour {total} {currency}. {deliveryMethod}"></textarea>
                      <div class="mt-2 text-[11px] text-gray-600">Aperçu: {{ messagePreview() }}</div>
                    </div>
                    <div class="mt-3">
                      <div class="text-sm font-semibold mb-1">Frais de livraison par zone</div>
                      <div class="space-y-2">
                        <div v-for="(z,zi) in checkout.delivery.zones" :key="zi" class="grid grid-cols-[1fr_120px_40px] gap-2">
                          <input v-model.trim="z.name" placeholder="Zone" class="rounded border px-2 py-1 text-xs" />
                          <input v-model.number="z.fee" type="number" placeholder="Frais" class="rounded border px-2 py-1 text-xs" />
                          <button class="rounded border bg-white px-2 py-1 text-xs" @click="removeZone(zi)">✕</button>
                        </div>
                        <button class="rounded border bg-white px-3 py-2 text-xs" @click="addZone">Ajouter une zone</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="tab==='menu'">
                  <div class="rounded-xl border bg-white p-3">
                    <div class="text-sm font-semibold mb-2">Menu</div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="item in visibleMenu()" :key="item.key" class="rounded-full border bg-white px-3 py-1 text-xs">{{ item.label }}</span>
                    </div>
                  </div>
                </div>
                <div v-else-if="tab==='apparence'">
                  <div v-if="appearance.bannerText" class="rounded-lg px-3 py-2 text-xs" :style="{ backgroundColor: appearance.background }">
                    <a v-if="appearance.bannerLink" :href="appearance.bannerLink" target="_blank" class="font-semibold" :style="{ color: appearance.primary }">{{ appearance.bannerText }}</a>
                    <span v-else class="font-semibold" :style="{ color: appearance.primary }">{{ appearance.bannerText }}</span>
                  </div>
                  <div v-if="appearance.popupEnabled" class="mt-3 rounded-xl border bg-white p-3">
                    <div class="text-sm font-semibold mb-1">{{ appearance.popupTitle || 'Offre de bienvenue spéciale' }}</div>
                    <div class="text-xs text-gray-700">{{ appearance.popupDescription || 'Bénéficiez de 20 % de réduction sur votre premier achat.' }}</div>
                    <div class="mt-2">
                      <a v-if="appearance.popupLink" :href="appearance.popupLink" target="_blank" class="rounded bg-gray-900 px-3 py-2 text-xs text-white">Découvrir</a>
                      <span v-else class="rounded border bg-white px-3 py-2 text-xs">Aucun lien</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toastShow" class="fixed bottom-4 right-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
      {{ toastMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { GripVertical, Eye, Trash, Menu, ShoppingCart } from 'lucide-vue-next'
definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const tab = ref<'vitrine'|'caisse'|'apparence'|'menu'>('vitrine')
const categories = ref<any[]>([])
const productsByCat = reactive<Record<string, any[]>>({})
const blocks = reactive<any[]>([])
const checkout = reactive<{ methods: { cash: boolean; momo: boolean; card: boolean }; require_phone: boolean; require_email: boolean; allow_notes: boolean; currency: string; delivery: { pickup: boolean; delivery: boolean; zones: Array<{ name: string; fee: number }> }; message_template: string }>({ methods: { cash: true, momo: true, card: false }, require_phone: true, require_email: false, allow_notes: true, currency: 'FCFA', delivery: { pickup: true, delivery: true, zones: [] }, message_template: 'Bonjour {store}, je confirme ma commande de {items} pour {total} {currency}. {deliveryMethod}' })
const appearance = reactive<{ color: string; logoUrl: string; primary: string; background: string; profileName: string; profileDescription: string; bannerText: string; bannerLink: string; popupEnabled: boolean; popupTitle: string; popupDescription: string; popupLink: string }>({ color: '#25D366', logoUrl: '', primary: '#25D366', background: '#ffffff', profileName: '', profileDescription: '', bannerText: '', bannerLink: '', popupEnabled: false, popupTitle: '', popupDescription: '', popupLink: '' })
const menuItems = reactive<Array<{ key: string; label: string; visible: boolean }>>([
  { key: 'home', label: 'Accueil', visible: true },
  { key: 'categories', label: 'Catégories', visible: true },
  { key: 'promos', label: 'Promos', visible: true }
])
const presetColors = ['#25D366', '#C03E37', '#111827', '#EF4444', '#10B981', '#2563EB']
const storeName = ref('Votre boutique')
const toastShow = ref(false)
const toastMsg = ref('')
function notify(msg: string) { toastMsg.value = msg; toastShow.value = true; setTimeout(() => toastShow.value = false, 1500) }
function categoryName(cid: number | null) { return categories.value.find(c => Number(c.id) === Number(cid))?.name || '' }
function firstImage(p: any) {
  const arr = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : [])
  return arr[0] || ''
}
const bannerCount = computed(() => String(appearance.bannerText || '').length)
const popupTitleCount = computed(() => String(appearance.popupTitle || '').length)
const popupDescCount = computed(() => String(appearance.popupDescription || '').length)
function escapeHtml(s: string) { return String(s || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') }
const profileDescHtml = computed(() => {
  const raw = escapeHtml(String(appearance.profileDescription || ''))
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/~([^~]+)~/g, '<del>$1</del>')
})
function addBlock(type: 'category'|'banner'|'popup' = 'category') {
  const id = String(Date.now() + Math.random())
  if (type === 'category') blocks.push({ id, type: 'category', category_id: null, layout: 'list', limit4: true, visible: true })
  else if (type === 'banner') blocks.push({ id, type: 'banner', text: '', link: '', visible: true })
  else blocks.push({ id, type: 'popup', title: '', description: '', link: '', visible: true })
}
function removeBlock(i: number) { blocks.splice(i, 1) }
function previewProducts(b: any) {
  const arr = productsByCat[String(b.category_id || 'all')] || []
  return (b.limit4 ? arr.slice(0, 4) : arr.slice(0, 8))
}
function moveUp(i: number) { if (i <= 0) return; const t = menuItems.splice(i, 1)[0]; menuItems.splice(i - 1, 0, t) }
function moveDown(i: number) { if (i >= menuItems.length - 1) return; const t = menuItems.splice(i, 1)[0]; menuItems.splice(i + 1, 0, t) }
function visibleMenu() { return menuItems.filter(x => x.visible) }
function addZone() { checkout.delivery.zones.push({ name: '', fee: 0 }) }
function removeZone(i: number) { checkout.delivery.zones.splice(i, 1) }
function messagePreview() {
  const items = '2 articles'
  const total = 5500
  const deliveryMethod = checkout.delivery.delivery ? 'Livraison' : 'Retrait'
  return String(checkout.message_template || '')
    .replace('{store}', storeName.value)
    .replace('{items}', items)
    .replace('{total}', String(total))
    .replace('{currency}', checkout.currency)
    .replace('{deliveryMethod}', deliveryMethod)
}
async function onLogoFileChange(e: any) {
  const f = e.target.files?.[0]
  if (!f) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'branding')
  const path = `stores/${storeId}/branding/${Date.now()}-${f.name}`
  const r = await supabase.storage.from(bucket).upload(path, f, { upsert: true })
  if (!r.error) {
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    appearance.logoUrl = publicUrl
    const { data: sone } = await supabase.from('stores').select('id').eq('id', storeId).maybeSingle()
    if (sone?.id) await supabase.from('stores').update({ image_url: publicUrl }).eq('id', sone.id)
    notify('Logo mis à jour')
  }
}
function applyPreset(color: string) {
  appearance.primary = color
  if (!appearance.color) appearance.color = color
}
async function loadData() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const { data: sone } = await supabase.from('stores').select('name,slug').eq('id', storeId).maybeSingle()
  storeName.value = String(sone?.name || 'Votre boutique')
  const slug = String(sone?.slug || '')
  const raw = slug ? localStorage.getItem(`design:${slug}`) : null
  try {
    const saved = raw ? JSON.parse(raw) : null
    if (saved?.blocks) {
      blocks.splice(0, blocks.length, ...saved.blocks)
    }
    if (saved?.checkout) {
      checkout.methods.cash = !!saved.checkout.methods?.cash
      checkout.methods.momo = !!saved.checkout.methods?.momo
      checkout.methods.card = !!saved.checkout.methods?.card
      checkout.require_phone = !!saved.checkout.require_phone
      checkout.require_email = !!saved.checkout.require_email
      checkout.allow_notes = !!saved.checkout.allow_notes
      checkout.currency = String(saved.checkout.currency || 'FCFA')
      checkout.delivery.pickup = !!saved.checkout.delivery?.pickup
      checkout.delivery.delivery = !!saved.checkout.delivery?.delivery
      checkout.delivery.zones.splice(0, checkout.delivery.zones.length, ...Array.isArray(saved.checkout.delivery?.zones) ? saved.checkout.delivery.zones : [])
      checkout.message_template = String(saved.checkout.message_template || checkout.message_template)
    }
    if (saved?.appearance) {
      appearance.color = String(saved.appearance.color || appearance.color)
      appearance.logoUrl = String(saved.appearance.logoUrl || '')
      appearance.primary = String(saved.appearance.primary || appearance.primary)
      appearance.background = String(saved.appearance.background || appearance.background)
      appearance.profileName = String(saved.appearance.profileName || '')
      appearance.profileDescription = String(saved.appearance.profileDescription || '')
      appearance.bannerText = String(saved.appearance.bannerText || '')
      appearance.bannerLink = String(saved.appearance.bannerLink || '')
      appearance.popupEnabled = !!saved.appearance.popupEnabled
      appearance.popupTitle = String(saved.appearance.popupTitle || '')
      appearance.popupDescription = String(saved.appearance.popupDescription || '')
      appearance.popupLink = String(saved.appearance.popupLink || '')
    }
    if (saved?.menu) {
      menuItems.splice(0, menuItems.length, ...Array.isArray(saved.menu) ? saved.menu : menuItems)
    }
  } catch {}
  const { data: c } = await supabase.from('categories').select('id,name').eq('store_id', storeId)
  categories.value = Array.isArray(c) ? c : []
  const { data: p } = await supabase.from('products').select('id,name,price,images,category_id').eq('store_id', storeId).order('created_at', { ascending: false }).limit(100)
  const rows = Array.isArray(p) ? p : []
  const map: Record<string, any[]> = { all: rows }
  for (const r of rows) {
    const key = String(r.category_id || 'none')
    map[key] = map[key] || []
    map[key].push(r)
  }
  Object.assign(productsByCat, map)
}
async function saveConfig() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const { data: sone } = await supabase.from('stores').select('slug').eq('id', storeId).maybeSingle()
  const slug = String(sone?.slug || '')
  if (!slug) return
  if (!checkout.methods.cash && !checkout.methods.momo && !checkout.methods.card) { notify('Sélectionnez au moins une méthode de paiement'); return }
  const payload = { blocks: JSON.parse(JSON.stringify(blocks)), checkout: JSON.parse(JSON.stringify(checkout)), appearance: JSON.parse(JSON.stringify(appearance)), menu: JSON.parse(JSON.stringify(menuItems)) }
  localStorage.setItem(`design:${slug}`, JSON.stringify(payload))
  const { data: storeRow } = await supabase.from('stores').select('id').eq('slug', slug).maybeSingle()
  if (storeRow?.id) {
    await supabase.from('stores').update({ color: appearance.color || null, image_url: appearance.logoUrl || null }).eq('id', storeRow.id)
  }
  try {
    const current = localStorage.getItem(`store:${slug}`)
    const v = current ? JSON.parse(current) : {}
    v.name = appearance.profileName || storeName.value
    v.logoUrl = appearance.logoUrl
    v.color = appearance.color || appearance.primary
    v.background = appearance.background
    localStorage.setItem(`store:${slug}`, JSON.stringify(v))
  } catch {}
  notify('Design mis à jour')
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
  await loadData()
})
useHead({ title: 'Admin | Design du site' })
</script>
