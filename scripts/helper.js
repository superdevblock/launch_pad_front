async function contractAt(name, address, provider) {
    let contractFactory = await ethers.getContractFactory(name)
    if (provider) {
      contractFactory = contractFactory.connect(provider)
    }
    return await contractFactory.attach(address)
}

module.exports = {
    contractAt
}