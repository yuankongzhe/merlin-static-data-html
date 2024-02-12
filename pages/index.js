// pages/index.js

import { useState, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';

const CurrencyCard = ({ currencyName, staked, btcPrice, onPriceChange, inputPrice ,isBrc20Token,isBrc420Token}) => {

  const priceInTotal = isBrc20Token ? staked * inputPrice * btcPrice *0.00000001 : isBrc420Token ? staked * inputPrice * btcPrice : staked * inputPrice;
  const unit = isBrc20Token ? ' sats/'+currencyName : isBrc420Token ?  'BTC' : ' /U';

  return (
    <div className='col-3 g-2'>
    <div className='card border-primary mb-3  h-100 '>
        <div className="card-header text-center">

        {currencyName}
      </div>
      <div className="card-body">
      <p className="card-text">
        质押数量: {formatNumber(staked.toFixed(2))}
      </p>
      <p className="card-text">
        单价: {formatNumber(inputPrice)}  {unit}
      </p>
      <p className="card-text">
        TVL: {formatNumber(priceInTotal.toFixed(0))} USD
      </p>

    </div>
    </div>
    </div>

  );
};

const currencyList = ['ORDI', 'SATS', 'BTCS', 'RATS', 'MMSS', 'AINN', 'RCSV', 'MICE', 'TRAC'];
const currency420List = ['Blue Box','Bitmap','This song about NFTs','Mineral']
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
const HomePage = () => {
  const [evmdata, evmsetData] = useState(null);
  const [btcdata, btcsetData] = useState(null);
  const [brc20data, brc20setData] = useState(null);
  const [brc420data, brc420setData] = useState(null);
  const [sumdata, sumsetData] = useState(null);

  // 设置状态
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0); 
  

   
  // Add state to store input prices
  const [currencyPrices, setCurrencyPrices] = useState(currencyList.reduce((acc, currency) => {
    acc[currency] = 0;
    return acc;
  }, {}));

  // Function to update the currency price and recalculate TVL
  const handlePriceChange = (currencyName, newPrice, staked) => {
    const price = parseFloat(newPrice) || 0;
    setCurrencyPrices({ ...currencyPrices, [currencyName]: price });

    // 需要重新计算其他币种的TVL
    const newSumUSD = currencyList.reduce((sum, cur) => {
      const stakedAmount = cur === 'BTC' ? btcdata.data.BTC.staked : brc20data.data[cur].staked;
      const curPrice = cur === currencyName ? price : currencyPrices[cur];
      const total = cur === 'BTC' ? stakedAmount * curPrice : stakedAmount * curPrice * btcdata.data.BTC.price*0.00000001;
      return sum + total;
    }, evmdata.data.ETH.staked * currencyPrices['ETH'] +
       evmdata.data.USDT.staked * currencyPrices['USDT'] +
       evmdata.data.USDC.staked * currencyPrices['USDC']);

    sumsetData({ ...sumdata, data: { ...sumdata.data, sum_usd: newSumUSD } });
  };
  useEffect(() => {
    const filename = 'evm_stakedsum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        evmsetData(evmdata);
      });
  }, []);
  useEffect(() => {
    const filename = 'btc_staked_balance_sum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        btcsetData(evmdata);
      });
  }, []);
  useEffect(() => {
    const filename = 'brc20_staked_balance_sum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        brc20setData(evmdata);
      });
  }, []);
  useEffect(() => {
    const filename = 'brc420_staked_balance_sum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        brc420setData(evmdata);
      });
  }, []);
  useEffect(() => {
    const filename = 'sum_usd'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        sumsetData(evmdata);
      });
  }, []);
  useEffect(() => {
    if (sumdata && sumdata.data) {
      setC(sumdata.data.sum_usd);
    }
  }, [sumdata]);
  // 如果数据还没加载，显示加载状态
  if (!evmdata) return <div>Loading...</div>;
  if (!btcdata) return <div>Loading...</div>;
  if (!brc20data) return <div>Loading...</div>;
  if (!sumdata) return <div>Loading...</div>;

  const Currency20Cards = currencyList.map((currencyName) => {
    const staked = brc20data.data[currencyName].staked;
    const inputPrice = currencyPrices[currencyName] || brc20data.data[currencyName].price_sat;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}
        onPriceChange={handlePriceChange}
        isBrc20Token={true}
        isBrc420Token={false}
      />
    );
  });
  const Currency420Cards = currency420List.map((currencyName) => {
    console.log(brc420data)
    const staked = brc420data.data[currencyName].staked;
    const inputPrice = currencyPrices[currencyName] || brc420data.data[currencyName].price_btc;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}
        onPriceChange={handlePriceChange}
        isBrc20Token={false}
        isBrc420Token={true}
      />
    );
  });
  // 当a变化时，更新b和c
  const handleAChange = (event) => {
    const newA = event.target.value;
    setA(newA);
    const calculatedB = newA * btcdata.data.BTC.price;
    setB(calculatedB);
    setC(calculatedB + sumdata.data.sum_usd);
  };

  // 当b变化时，更新a和c
  const handleBChange = (event) => {
    const newB = event.target.value;
    setB(newB);
    const calculatedA = newB / btcdata.data.BTC.price;
    setA(calculatedA);
    setC(Number(newB) + sumdata.data.sum_usd);
  };
  // 显示数据和保存时间
  return (
    <main className="bd-main order-1">
      
      <div className='row'>
        <div className='col-2'></div>
        <div className='card col-8 '>
        <div className="card-header text-center container">
            <div className=' text-muted'>            
            由 <a href="https://twitter.com/0xfaskety" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1458"><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z" p-id="1459" fill="#000"></path></svg>
            @0xfaskety</a>  创建
            </div>
            <span class="h3">Merlin Seal TVL: {formatNumber(c.toFixed(0))} USD</span>
          </div>
          <div className='card-body container ' >
            <div className='row '>
            <CurrencyCard 
                currencyName="BTC" 
                staked={btcdata.data.BTC.staked} 
                priceInTotal={btcdata.data.BTC.staked * btcdata.data.BTC.price} 
                inputPrice={btcdata.data.BTC.price}
                onPriceChange={handlePriceChange}
                isBrc20Token={false}
                isBrc420Token={false}
              />
              <CurrencyCard 
              currencyName="ETH" 
              staked={evmdata.data.ETH.staked} 
              priceInTotal={evmdata.data.ETH.price_in_usd} 
              inputPrice={evmdata.data.ETH.price}
              onPriceChange={handlePriceChange}
              isBrc20Token={false}
              isBrc420Token={false}
            />
            <CurrencyCard 
              currencyName="USDT" 
              staked={evmdata.data.USDT.staked} 
              priceInTotal={evmdata.data.USDT.price_in_usd} 
              inputPrice={evmdata.data.USDT.price}
              onPriceChange={handlePriceChange}
              isBrc20Token={false}
              isBrc420Token={false}
            />
            <CurrencyCard 
              currencyName="USDC" 
              staked={evmdata.data.USDC.staked} 
              priceInTotal={evmdata.data.USDC.price_in_usd} 
              inputPrice={evmdata.data.USDC.price}
              onPriceChange={handlePriceChange}
              isBrc20Token={false}
              isBrc420Token={false}
            />

            {Currency20Cards}
            {Currency420Cards}
            {/* <div className='col-3 g-2'>
            <div className='card mb-3 border-primary h-100 '>
              <div className="card-header text-center">
              BRC420
              </div>
              <div className="card-body">
              <p className="card-text">
                TVL:       
                <input
                  className = ""
                  type="number"
                  value={a}
                  onChange={handleAChange}
                />
                  BTC
              </p>
              <p className="card-text">
                TVL:       
                <input
                  type="number"
                  value={b}
                  onChange={handleBChange}
                />
                  USD
              </p>
            </div>
              

            </div>
            </div> */}
            </div>
            <div>

    </div>
          </div>
          <div className="card-footer text-muted row">
            <div className='col-12'>注意：本站brc420质押情况更新速度较慢</div>
            <div className='col-8'>更快brc420质押更新情况请前往
              <a href="https://bitmap.date/merlin/" target="_blank" rel="noopener noreferrer">
              https://bitmap.date/merlin/
            </a>
            查看
            </div>
           <div className='col-4 '><span className='h6'>更新于：{sumdata.savetime}</span></div>
           <Analytics />
           <SpeedInsights/>
          </div>
        

        </div>
        <div className='col-2'></div>
        
      </div>

    </main>
    
  );
};

export default HomePage;