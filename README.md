# dms_2_dd
A nodejs json api that converts dms to dd 

```bash
cd dms_2_dd
docker build -t dms2dd .
docker run -d -p 8086:8080 dms2dd 
```

# Url Queries:

```python
import requests
requests.get('http://[ip address]:8086/?dlat=44&mlat=33&slat=22&dlon=44&mlon=33')
```

Returns decimal degree coordinates in a json object:

```json
{"latitude":44.556111,"longitude":44.55}
```
