## 한국 지진 지도

한국지진지도 프로젝트는 1971년부터 2017년까지 한국내 지진 목록을 수합, 가공하여 `geojson` 형식으로 제공합니다. 데이터 출처는 다음과 같습니다.

- [기상청 국내지진목록](http://www.kma.go.kr/weather/earthquake_volcano/domesticlist.jsp)

다음 커맨드를 이용하여 데이터 수합, 가공 과정을 반복할 수 있습니다. (Node를 필요로합니다.)

```
npm install
node scrape-data.js
```
수합된 데이터의 시각화는 본 리포의 [깃허브 페이지](https://hanbyul-here.github.io/earthquakes-in-korea/public/)에서 확인할 수 있습니다.

## Earthquakes in Korean Peninsular

This project scrapes the list of earthquakes in Korean Peninsular from [KMA](http://www.kma.go.kr/weather/earthquake_volcano/domesticlist.jsp), offers the data as `geojson`.

To repeat data scraping process, you can run commands below. (Node required)

```
npm install
node
```
You can see the visualized data with a map [here](https://hanbyul-here.github.io/earthquakes-in-korea/public/)