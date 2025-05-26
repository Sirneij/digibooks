<script lang="ts">
	import { addToCart, formatMoney } from '$lib/utils/helpers';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.book?.title || 'Book Details'} - DigiBooks</title>
</svelte:head>

{#if data.book}
	<div class="overflow-hidden rounded-lg bg-white shadow-xl md:flex">
		<div class="md:w-1/3">
			<img
				src={data.book.coverImageUrl || 'https://placehold.co/400x600/e2e8f0/cbd5e0?text=No+Image'}
				alt="Cover image for {data.book.title}"
				class="h-auto w-full object-cover md:h-full"
			/>
		</div>
		<div class="flex flex-col p-6 md:w-2/3 md:p-8">
			<h1 class="text-text-base mb-2 text-3xl font-bold md:text-4xl">{data.book.title}</h1>
			<p class="text-text-muted mb-4 text-lg">by {data.book.author}</p>
			<p class="text-primary mb-6 text-3xl font-bold">{formatMoney(data.book.priceInCents)}</p>

			<div class="prose prose-sm sm:prose lg:prose-lg xl:prose-xl text-text-muted mb-6 max-w-none">
				{@html data.book.description || 'No description available.'}
			</div>

			<div class="mt-auto">
				<button
					onclick={() => addToCart(data.book)}
					class="bg-primary hover:bg-primary-hover focus:ring-primary w-full rounded-md px-6 py-3 text-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:w-auto"
				>
					Add to Cart
				</button>
			</div>
		</div>
	</div>
{:else}
	<p class="text-text-muted py-10 text-center text-xl">Book not found.</p>
{/if}
