<script>
    import { onMount } from "svelte";

    export let title = "";
    export let style = "";
    export let highlight = "";
    export let comment = "";
    let pos;
    let top = 0;

    onMount(() => {
        console.log(pos.getBoundingClientRect().top)
        top = pos.getBoundingClientRect().top;
    });

    function handleClick() {
        console.log(pos.getBoundingClientRect().top)
        top = pos.getBoundingClientRect().top;
    }
</script>

<div>
    <label bind:this={pos} class="ob-comment" {title} {style}>
        {highlight} <input type="checkbox" on:click={handleClick} />
        <span style="top:{top}px !important"> {comment} </span></label
    >
</div>

<style>
    .ob-comment {
        position: relative;
        border-bottom: 1px dotted black;
        color: #8f0303;
        font-weight: bold;
        background-color: #cca300;
        word-wrap: break-word;
        white-space: normal;
    }

    .ob-comment:hover {
        background-color: #ffde5c;
    }

    .ob-comment span {
        visibility: hidden;
        min-width: auto;
        max-width: 500px;
        width: max-content;
        background-color: #ffde5c;
        color: #b30202;
        text-align: left;
        border-radius: 6px;
        padding: 10px 10px;
        z-index: 1;

        position: absolute;
        top: 20px;
        right: 20px;

        box-shadow: 1px 1px 10px 5px var(--background-secondary);
        transition: opacity 1s;
    }

    .ob-comment input {
        display: none;
    }
    .ob-comment input:checked + span {
        visibility: visible;
        opacity: 1;
    }

    input:checked + span {
        height: auto;
        right: 0px !important;
        top: 40px;
    }
</style>
