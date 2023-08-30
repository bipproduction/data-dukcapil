'use client'

import { Box, Button, Center, CopyButton, Flex, Group, Loader, Overlay, Stack, Text } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import _ from "lodash"
import { useState } from "react"
import toas from 'react-simple-toasts'

export default function ViewMain() {
    const [from, setFrom] = useState(0)
    const [tsvData, setValue] = useState("")
    const [loadingNext, setLoadingNext] = useState(false)
    const [loadingPrev, setLoadingPrev] = useState(false)
    const [loadingContent, setLoadingContent] = useState(false)
    const count = 100;

    const [isClient, setIsClient] = useState(false)

    useShallowEffect(() => {
        loadData(0)
    }, [])

    useShallowEffect(() => {
        if (window) setIsClient(true)
    }, [])
    async function loadData(berapa: any) {
        setLoadingContent(true)
        fetch(`/api/find-data?from=${berapa}`,).then(v => v.text()).then(v => {
            setValue(v)
            setLoadingContent(false)
        })
    }

    const renderTable = () => {
        const rows = tsvData.split('\n').map((row, index) => (
            <tr key={index}>
                {row.split('\t').map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                ))}
            </tr>
        ));

        return (
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    };

    if (!isClient) return <></>

    return (<>
        <Stack>
            <Group position="center" p={"md"} mah={720}>
                <Flex bg={"gray"}>
                    <Button loading={loadingPrev} onClick={async () => {
                        setLoadingPrev(true)
                        let berapa = _.clone(from)

                        berapa -= count;
                        if (berapa < 1) {
                            setLoadingPrev(false)
                            berapa = _.clone(from)
                            return toas("gak bisa kuarang dari 0")
                        }
                        setFrom(berapa)
                        await loadData(berapa)
                        setLoadingPrev(false)
                    }}>Prev</Button>

                    <Text fz={24} px={"md"}>{from} [{count}]</Text>
                    <Button loading={loadingNext} onClick={async () => {
                        setLoadingNext(true)
                        let berapa = _.clone(from)
                        berapa += count;
                        setFrom(berapa)
                        await loadData(berapa)
                        setLoadingNext(false)
                    }} >Next</Button>
                </Flex>
            </Group>
            <Box >
                <h1>Data Dukcapil</h1>

                <div style={{
                    overflow: "scroll"
                }}>
                    <Box pos={"relative"}>
                        <Group position="right" p={"md"}>
                            <CopyButton value={tsvData}>
                                {({ copied, copy }) => (
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                        {copied ? 'Copied url' : 'Copy url'}
                                    </Button>
                                )}
                            </CopyButton>
                        </Group>
                        {tsvData && renderTable()}
                        {loadingContent && <Overlay>
                            <Center w={"100wh"} h={"100vh"}>
                                <Loader />
                            </Center></Overlay>}
                    </Box>
                </div>
            </Box>
        </Stack>
    </>)
}