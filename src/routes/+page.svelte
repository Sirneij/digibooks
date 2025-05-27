<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import { addToCart } from '$lib/utils/helpers';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { close, grid, list, search } from '$lib/components/utils/Icons.svelte';

	let { data }: { data: PageData } = $props();

	// Get current search params from URL
	const searchQuery = $derived(page.url.searchParams.get('search') || '');
	const sortBy = $derived(page.url.searchParams.get('sort') || 'featured');
	const viewMode = $derived((page.url.searchParams.get('view') as 'grid' | 'list') || 'list');

	// Form values for controlled inputs
	let searchInput = $state('');
	let sortInput = $state('');

	// Update form values when URL params change
	$effect(() => {
		searchInput = searchQuery;
		sortInput = sortBy;
	});

	// Handle search form submission
	async function handleSearch(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const search = formData.get('search') as string;
		const sort = formData.get('sort') as string;

		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (sort && sort !== 'featured') params.set('sort', sort);
		if (viewMode !== 'grid') params.set('view', viewMode);

		await goto(`?${params.toString()}`, { replaceState: true });
	}

	// Handle view mode change
	async function changeViewMode(mode: 'grid' | 'list') {
		const params = new URLSearchParams(page.url.searchParams);
		if (mode !== 'list') {
			params.set('view', mode);
		} else {
			params.delete('view');
		}

		await goto(`?${params.toString()}`, { replaceState: true });
	}

	// Clear search
	async function clearSearch() {
		const params = new URLSearchParams(page.url.searchParams);
		params.delete('search');
		await goto(`?${params.toString()}`, { replaceState: true });
	}
</script>

<svelte:head>
	<title>Books - DigiBooks</title>
</svelte:head>

<div class="space-y-8">
	<!-- Clean Header -->
	<div class="text-center">
		<h1 class="text-content mb-3 text-4xl font-bold">Digital Books</h1>
		<p class="text-content-muted">Discover your next great read</p>
	</div>

	<!-- Search & Sort Form -->
	<div class="mx-auto max-w-2xl space-y-4">
		<form onsubmit={handleSearch} class="space-y-4">
			<!-- Search -->
			<div class="relative">
				{@render search({
					class: 'text-content-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2',
					'aria-hidden': 'true'
				})}
				<input
					name="search"
					bind:value={searchInput}
					type="text"
					placeholder="Search books or authors..."
					class="border-border focus:border-primary focus:ring-primary w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="text-content-muted hover:text-content absolute right-3 top-1/2 -translate-y-1/2"
						aria-label="Clear search"
					>
						{@render close({
							class: 'h-4 w-4',
							'aria-hidden': 'true'
						})}
					</button>
				{/if}
			</div>

			<!-- Sort and View Controls -->
			<div class="flex items-center justify-between">
				<p class="text-content-muted text-sm">
					{data.books.length} books
				</p>

				<div class="flex items-center space-x-3">
					<!-- Sort Dropdown -->
					<select
						name="sort"
						bind:value={sortInput}
						onchange={() => {
							// Auto-submit on sort change
							const form = document.querySelector('form') as HTMLFormElement;
							form.requestSubmit();
						}}
						class="border-border focus:border-primary focus:ring-primary rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1"
					>
						<option value="featured">Featured</option>
						<option value="title">Title</option>
						<option value="author">Author</option>
						<option value="price-low">Price ↑</option>
						<option value="price-high">Price ↓</option>
					</select>

					<!-- View Toggle -->
					<div class="border-border flex rounded-lg border bg-white p-1">
						<button
							type="button"
							onclick={() => changeViewMode('grid')}
							class="rounded px-2 py-1 text-sm transition-all duration-200"
							class:bg-primary={viewMode === 'grid'}
							class:text-white={viewMode === 'grid'}
							class:text-content-muted={viewMode !== 'grid'}
							aria-label="Grid view"
						>
							{@render grid({
								class: 'h-4 w-4',
								'aria-hidden': 'true'
							})}
						</button>
						<button
							type="button"
							onclick={() => changeViewMode('list')}
							class="rounded px-2 py-1 text-sm transition-all duration-200"
							class:bg-primary={viewMode === 'list'}
							class:text-white={viewMode === 'list'}
							class:text-content-muted={viewMode !== 'list'}
							aria-label="List view"
						>
							{@render list({
								class: 'h-4 w-4',
								'aria-hidden': 'true'
							})}
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>

	<!-- Books Grid/List -->
	{#if data.books.length > 0}
		<div
			class="grid gap-6 transition-all duration-300"
			class:grid-cols-1={viewMode === 'list'}
			class:sm:grid-cols-2={viewMode === 'grid'}
			class:lg:grid-cols-3={viewMode === 'grid'}
			class:xl:grid-cols-4={viewMode === 'grid'}
		>
			{#each data.books as book, index (book.id)}
				<div in:fly={{ y: 20, duration: 300, delay: index * 30 }}>
					<BookCard {book} {viewMode} addToCart={() => addToCart(book)} />
				</div>
			{/each}
		</div>
	{:else if searchQuery}
		<!-- No Results -->
		<div class="py-16 text-center">
			<p class="text-content mb-2">No books found for "{searchQuery}"</p>
			<button onclick={clearSearch} class="text-primary text-sm hover:underline">
				Clear search
			</button>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="py-16 text-center">
			<p class="text-content-muted">No books available at the moment</p>
		</div>
	{/if}
</div>
