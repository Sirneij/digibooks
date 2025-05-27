<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	export {
		loader,
		shield,
		check,
		plus,
		cart,
		book,
		trash,
		minus,
		close,
		alert,
		docs,
		logo,
		search,
		grid,
		list
	};
</script>

{#snippet loader(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" {...props}>
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
		></circle>
		<path
			class="opacity-75"
			fill="currentColor"
			d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
{/snippet}

{#snippet shield(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
		/>
	</svg>
{/snippet}

{#snippet check(props?: HTMLAttributes<SVGElement>)}
	<svg fill="currentColor" viewBox="0 0 20 20" {...props}
		><path
			fill-rule="evenodd"
			d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16m3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0z"
			clip-rule="evenodd"
		/></svg
	>
{/snippet}

{#snippet plus(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 4v16m8-8H4"
		/></svg
	>
{/snippet}
{#snippet cart(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="1.5"
			d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a2 2 0 104 0m-4 0a2 2 0 014 0"
		/>
	</svg>
{/snippet}
{#snippet book(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
		/></svg
	>
{/snippet}

{#snippet trash(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m19 7-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
		/></svg
	>
{/snippet}

{#snippet minus(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
	</svg>
{/snippet}

{#snippet close(props?: HTMLAttributes<SVGElement>)}
	<svg fill="currentColor" viewBox="0 0 20 20" {...props}
		><path
			fill-rule="evenodd"
			d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16M8.707 7.293a1 1 0 0 0-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 1 0 1.414 1.414L10 11.414l1.293 1.293a1 1 0 0 0 1.414-1.414L11.414 10l1.293-1.293a1 1 0 0 0-1.414-1.414L10 8.586z"
			clip-rule="evenodd"
		/></svg
	>
{/snippet}

{#snippet alert(props?: HTMLAttributes<SVGElement>)}
	<svg fill="currentColor" viewBox="0 0 20 20" {...props}
		><path
			fill-rule="evenodd"
			d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-8a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1"
			clip-rule="evenodd"
		/></svg
	>
{/snippet}

{#snippet docs(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2"
		/></svg
	>
{/snippet}

{#snippet logo(props?: HTMLAttributes<SVGElement>)}
	<svg fill="currentColor" viewBox="0 0 24 24" {...props}
		><path
			d="M21 5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-4 12H7V7h10z"
		/><circle cx="9" cy="9" r="1" /><circle cx="15" cy="15" r="1" /><circle
			cx="9"
			cy="15"
			r="1"
		/><circle cx="15" cy="9" r="1" /></svg
	>
{/snippet}

{#snippet search(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0"
		/></svg
	>
{/snippet}

{#snippet grid(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm10 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zM4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm10 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"
		/></svg
	>
{/snippet}

{#snippet list(props?: HTMLAttributes<SVGElement>)}
	<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6h16M4 10h16M4 14h16M4 18h16"
		/></svg
	>
{/snippet}
