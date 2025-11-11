<template>
    <UContainer class="Donation">
        <div class="ImageBox">
            <p>Image Goes Here</p>
        </div>
        <div class="NameBox">
            <p>Donation 1</p>
        </div>
        <div class="StatusBox"> 
            <UIcon name="i-lucide-lightbulb" class="size-5" />
            <p>In Transit</p>
        </div>
        
    </UContainer>
</template>

<style>
.Donation {
    display: flex;
    background-color: #666666;
    border-radius: 8px;
    justify-content: space-evenly;
    height: 100px;
    
}

.ImageBox {
    display: flex;
    width: 30%;
}

.NameBox {
    display: flex;
    width: 30%;
}

.StatusBox {
    display: flex;
    width: 40%;
}
</style>