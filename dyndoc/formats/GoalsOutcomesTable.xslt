<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>

<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
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

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
    <!--Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/goalscommon.xslt"/>
    <!--Uncomment this line to debug <xsl:include href="goalscommon.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/tablecommon.xslt"/>
    <!--Uncomment this line to debug <xsl:include href="tablecommon.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/emrinfocommon.xslt"/>
    <!--Uncomment this line to debug <xsl:include href="emrinfocommon.xslt" />-->

    <xsl:variable name="goalHeading" as="xs:string" select="'Goal Description'"/>
    <xsl:variable name="isMetHeading" as="xs:string" select="'Met/Not Met'"/>
    <xsl:variable name="outcomeHeading" as="xs:string" select="'Outcome'"/>
    <xsl:variable name="metDisplay" as="xs:string" select="'Met'"/>
    <xsl:variable name="notMetDisplay" as="xs:string" select="'Not Met'"/>

    <xsl:template match="/">
        <xsl:if test="n:report/n:clinical-data/n:goal-data/n:goal/n:comment/n:comment != ''">

            <xsl:call-template name="emitTableStart">
                <xsl:with-param name="retainRowsInPlainText" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitHeadingStart">
                <xsl:with-param name="repeatHeadingOnPrintedPages" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$goalHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$isMetHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$outcomeHeading"/></xsl:call-template>
            <xsl:call-template name="emitHeadingEnd"/>

            <tbody>
                <!-- Reuse logic in GoalsCommon to bucket and sort goals, then calls displayGoal below -->
                <xsl:call-template name="emitGoals"/>
            </tbody>

            <xsl:call-template name="emitTableEnd"/>

        </xsl:if>
    </xsl:template>

    <!-- Called from emitGoals in GoalsCommon.xslt, assume a goal element in context -->
    <xsl:template name="displayGoal">

        <xsl:if test="n:comment/n:comment != ''">
            <xsl:variable name="isMetDisplay" as="xs:string">
                <xsl:choose>
                    <xsl:when test="@is-met = true()">
                        <xsl:value-of select="$metDisplay"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$notMetDisplay"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:variable>

            <tr class="ddemrcontentitem ddremovable" style="page-break-inside: avoid;" dd:btnfloatingstyle="top-right">

                <xsl:if test="@id">
                    <xsl:attribute name="dd:entityid">
                        <xsl:value-of select="@id"/>
                    </xsl:attribute>
                </xsl:if>

                <xsl:attribute name="dd:contenttype">
                    <xsl:text>GOALS</xsl:text>
                </xsl:attribute>

                <!-- Emit goal outcome description -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@description != ''">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'GL_DESC'"/>
                        <xsl:with-param name="Content" select="@description"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit whether goal is met or not -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@is-met">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'GL_ISMET'"/>
                        <xsl:with-param name="Content" select="$isMetDisplay"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit goal outcome comment -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:comment/n:comment != ''">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'GL_COMMENT'"/>
                        <xsl:with-param name="Content" select="n:comment/n:comment/text()"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

            </tr>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>
