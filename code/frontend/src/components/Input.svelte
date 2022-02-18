<script>
    export let label
    export let value
</script>


<div class="input-group mb-3">
    <lable for={label} >{label}</lable>
    <input bind:value id="{label}" name="{label}" {...$$restProps}  >
</div>