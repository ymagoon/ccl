<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    xmlns:goalfx="urn:com-cerner-physician-documentation-goals-functions"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    exclude-result-prefixes="xsl xs fn cdocfx n dd xr-date-formatter goalfx">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!--Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/tablecommon.xslt" />
    <!--Uncomment this line to debug <xsl:include href="tablecommon.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/emrinfocommon.xslt"/>
    <!--Uncomment this line to debug <xsl:include href="emrinfocommon.xslt" />-->

    <xsl:variable name="descriptionHeading" as="xs:string" select="'Description'"/>
    <xsl:variable name="onsetHeading" as="xs:string" select="'Onset Date'"/>
    <xsl:variable name="sourceHeading" as="xs:string" select="'Source'"/>
    <xsl:variable name="categoryHeading" as="xs:string" select="'Category'"/>
    <xsl:variable name="commentHeading" as="xs:string" select="'Comments'"/>

    <xsl:variable name="DATE_SEQUENCE" as="xs:string" select="'[M01]/[D01]/[Y0001]'"/>

    <xsl:template match="/">
        <xsl:if test="n:report/n:clinical-data/n:health-concern-data/n:health-concern">

            <xsl:call-template name="emitTableStart">
                <xsl:with-param name="retainRowsInPlainText" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitHeadingStart">
                <xsl:with-param name="repeatHeadingOnPrintedPages" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$categoryHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$descriptionHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$onsetHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$sourceHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$commentHeading"/></xsl:call-template>

            <xsl:call-template name="emitHeadingEnd"/>

            <tbody>
                <xsl:call-template name="emitHealthConcernRows"/>
            </tbody>

            <xsl:call-template name="emitTableEnd"/>
            <xsl:value-of disable-output-escaping="yes" select="$newLine"/>

        </xsl:if>
    </xsl:template>

    <xsl:template name="emitHealthConcernRows">

        <xsl:for-each select="n:report/n:clinical-data/n:health-concern-data/n:health-concern">

            <xsl:sort select="cdocfx:getCodeDisplayByID(@category-code)"/>
            <xsl:sort select="n:description/text()"/>

            <tr class="ddemrcontentitem ddremovable" style="page-break-inside: avoid;" dd:btnfloatingstyle="top-right">
                <xsl:if test="@health-concern-instance-uuid">
                    <xsl:attribute name="dd:entityid">
                        <xsl:value-of select="@health-concern-instance-uuid"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:attribute name="dd:contenttype">
                    <xsl:text>HEALTHCONCRN</xsl:text>
                </xsl:attribute>

                <!-- Emit health concern category-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@category-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(@category-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit health concern description -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:description != ''">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'HC_DESC'"/>
                        <xsl:with-param name="Content" select="n:description/text()"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit health concern onset date -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@onset-date">
                    <xsl:value-of select="fn:format-date(@onset-date, $DATE_SEQUENCE)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit health concern source -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@source-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(@source-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit health concern comment-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:comments/text() != ''">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'HC_COMMENT'"/>
                        <xsl:with-param name="Content" select="n:comments/text()"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

            </tr>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>
